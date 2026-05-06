const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc  Create Razorpay order
// @route POST /api/payment/create-order
// @access Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Access denied"); }

  const options = {
    amount:   Math.round(order.totalPrice * 100),
    currency: "INR",
    receipt:  `receipt_${order._id}`,
    notes:    { orderId: order._id.toString(), userId: req.user._id.toString() },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    success: true,
    data: {
      razorpay_order_id: razorpayOrder.id,
      amount:            razorpayOrder.amount,
      currency:          razorpayOrder.currency,
      key:               process.env.RAZORPAY_KEY_ID,
    },
  });
});

// @desc  Verify Razorpay payment signature & update order
// @route POST /api/payment/verify
// @access Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed — invalid signature");
  }

  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  order.isPaid       = true;
  order.paidAt       = Date.now();
  order.orderStatus  = "paid";
  order.paymentResult = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status:      "captured",
    update_time: new Date().toISOString(),
  };
  await order.save();

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });

  res.json({ success: true, message: "Payment verified successfully", data: order });
});

// @desc  Razorpay webhook handler
// @route POST /api/payment/webhook
// @access Public (verified by signature)
const webhookHandler = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers["x-razorpay-signature"];

  if (webhookSecret) {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (receivedSignature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }
  }

  const { event, payload } = req.body;

  if (event === "payment.captured") {
    const { order_id } = payload.payment.entity;
    const order = await Order.findOne({ "paymentResult.razorpay_order_id": order_id });
    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.orderStatus = "paid";
      await order.save();
    }
  }

  if (event === "payment.failed") {
    const { order_id } = payload.payment.entity;
    const order = await Order.findOne({ "paymentResult.razorpay_order_id": order_id });
    if (order) {
      order.orderStatus = "failed";
      await order.save();
    }
  }

  res.json({ received: true });
});

module.exports = { createRazorpayOrder, verifyPayment, webhookHandler };
