// cartRoutes.js
const cartRouter = require("express").Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

cartRouter.use(protect);
cartRouter.route("/").get(getCart).post(addToCart).delete(clearCart);
cartRouter.route("/:itemId").put(updateCartItem).delete(removeFromCart);

module.exports = cartRouter;
