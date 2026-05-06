import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">Shop<span>MERN</span></Link>

        <nav className="navbar-nav">
          <Link to="/products">Products</Link>
          {isAuthenticated && <Link to="/orders">Orders</Link>}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-icon" aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <div className="user-dropdown">
                  <div className="dropdown-header">{user.name}<span>{user.email}</span></div>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">My Orders</Link>
                  <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
