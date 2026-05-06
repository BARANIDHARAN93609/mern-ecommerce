const router = require("express").Router();
const { createOrder, getMyOrders, getOrder, markDelivered, getAllOrders } = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/deliver", protect, admin, markDelivered);

module.exports = router;
