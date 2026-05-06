const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price emoji image countInStock");
  res.json({ success: true, data: cart || { items: [], totalPrice: 0 } });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  if (product.countInStock < quantity) { res.status(400); throw new Error("Not enough stock"); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingIdx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (existingIdx >= 0) {
    cart.items[existingIdx].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }
  cart.calcTotal();
  await cart.save();
  await cart.populate("items.product", "name price emoji image countInStock");
  res.json({ success: true, data: cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Cart not found"); }

  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error("Item not found in cart"); }

  if (quantity <= 0) {
    cart.items.pull({ _id: req.params.itemId });
  } else {
    item.quantity = quantity;
  }
  cart.calcTotal();
  await cart.save();
  await cart.populate("items.product", "name price emoji image countInStock");
  res.json({ success: true, data: cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Cart not found"); }
  cart.items.pull({ _id: req.params.itemId });
  cart.calcTotal();
  await cart.save();
  res.json({ success: true, message: "Item removed from cart" });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
