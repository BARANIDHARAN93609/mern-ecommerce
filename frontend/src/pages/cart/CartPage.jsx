import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import Spinner from "../../components/ui/Spinner";
import "./CartPage.css";

const CartPage = () => {
  const { cart, loading, subtotal } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > 2000 ? 0 : 99;
  const tax      = Math.round(subtotal * 0.18);
  const total    = subtotal + shipping + tax;

  if (loading) return <Spinner center />;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        {!cart.items?.length ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items card">
              {cart.items.map((item) => <CartItem key={item._id} item={item} />)}
            </div>

            <div className="cart-summary card">
              <h2>Order Summary</h2>
              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free">Free</span> : `₹${shipping}`}</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString("en-IN")}</span></div>
                {subtotal > 0 && subtotal <= 2000 && <p className="shipping-note">Add ₹{(2000 - subtotal).toLocaleString("en-IN")} more for free shipping!</p>}
              </div>
              <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              <button className="btn btn-primary btn-full" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
              <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: 10 }}>Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
