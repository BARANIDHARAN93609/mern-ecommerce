const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     { type: String, required: true },
  emoji:    { type: String, default: "📦" },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems:    [orderItemSchema],
    shippingAddress: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },
    itemsPrice:    { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice:      { type: Number, required: true, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, required: true, default: "Razorpay" },
    paymentResult: {
      razorpay_order_id:   { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature:  { type: String },
      status:              { type: String },
      update_time:         { type: String },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "failed"],
      default: "pending",
    },
    isPaid:       { type: Boolean, default: false },
    paidAt:       { type: Date },
    isDelivered:  { type: Boolean, default: false },
    deliveredAt:  { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
