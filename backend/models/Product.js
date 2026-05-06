const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: [true, "Product name is required"], trim: true },
    description:   { type: String, required: [true, "Description is required"] },
    price:         { type: Number, required: [true, "Price is required"], min: 0 },
    category:      { type: String, required: [true, "Category is required"] },
    brand:         { type: String, default: "" },
    image:         { type: String, default: "" },
    emoji:         { type: String, default: "📦" },
    countInStock:  { type: Number, required: true, default: 0, min: 0 },
    reviews:       [reviewSchema],
    rating:        { type: Number, default: 0 },
    numReviews:    { type: Number, default: 0 },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
