const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "Razorpay" } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) { res.status(400); throw new Error("Cart is empty"); }

  const itemsPrice    = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 2000 ? 0 : 99;
  const taxPrice      = Math.round(itemsPrice * 0.18);
  const totalPrice    = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.items.map((i) => ({
      product:  i.product._id,
      name:     i.product.name,
      emoji:    i.product.emoji,
      price:    i.price,
      quantity: i.quantity,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, data: order });
});

// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ success: true, data: orders });
});

// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Access denied");
  }
  res.json({ success: true, data: order });
});

// @route PUT /api/orders/:id/deliver  (admin only)
const markDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.orderStatus = "delivered";
  await order.save();
  res.json({ success: true, data: order });
});

// @route GET /api/orders  (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort("-createdAt");
  res.json({ success: true, data: orders });
});

module.exports = { createOrder, getMyOrders, getOrder, markDelivered, getAllOrders };
