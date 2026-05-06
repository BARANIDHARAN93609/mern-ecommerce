import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct, addReview } from "../../api/services";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct(id)
      .then(({ data }) => setProduct(data.data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner center />;
  if (!product) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    await addItem(product._id, qty);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    setSubmitting(true);
    try {
      await addReview(product._id, review);
      toast.success("Review submitted!");
      const { data } = await fetchProduct(id);
      setProduct(data.data);
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="detail-grid">
          <div className="detail-img">
            {product.image
              ? <img src={product.image} alt={product.name} />
              : <div className="detail-emoji">{product.emoji}</div>}
          </div>
          <div className="detail-info">
            <span className="detail-cat">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            <div className="detail-rating">
              {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
              <span>{product.numReviews} reviews</span>
            </div>
            <p className="detail-price">₹{product.price.toLocaleString("en-IN")}</p>
            {product.brand && <p className="detail-brand">Brand: <strong>{product.brand}</strong></p>}
            <p className="detail-desc">{product.description}</p>
            <div className="detail-stock">
              {product.countInStock > 0
                ? <span className="badge badge-success">In Stock ({product.countInStock})</span>
                : <span className="badge badge-danger">Out of Stock</span>}
            </div>
            {product.countInStock > 0 && (
              <div className="detail-actions">
                <div className="qty-wrap">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))}>+</button>
                </div>
                <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              </div>
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h2>Customer Reviews ({product.numReviews})</h2>
          {product.reviews.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
          {product.reviews.map((r) => (
            <div key={r._id} className="review-card card">
              <div className="review-header">
                <strong>{r.name}</strong>
                <span className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}

          {isAuthenticated && (
            <form className="review-form card" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select className="form-input" value={review.rating} onChange={(e) => setReview((r) => ({ ...r, rating: Number(e.target.value) }))}>
                  {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-input" rows={3} value={review.comment} onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit Review"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
