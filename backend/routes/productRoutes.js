const router = require("express").Router();
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, addReview, getCategories,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/categories", getCategories);
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProduct).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post("/:id/reviews", protect, addReview);

module.exports = router;
