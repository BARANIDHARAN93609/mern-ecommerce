import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addItem, loading } = useCart();
  const { isAuthenticated }  = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Please login to add items"); navigate("/login"); return; }
    await addItem(product._id, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-img-wrap">
        {product.image
          ? <img src={product.image} alt={product.name} loading="lazy" />
          : <div className="product-emoji">{product.emoji}</div>}
        {product.countInStock === 0 && <span className="out-of-stock-badge">Out of stock</span>}
      </Link>
      <div className="product-card-body">
        <div className="product-cat">{product.category}</div>
        <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>
        <div className="product-rating">
          {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
          <span>({product.numReviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={loading || product.countInStock === 0}
          >
            {product.countInStock === 0 ? "Sold out" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
