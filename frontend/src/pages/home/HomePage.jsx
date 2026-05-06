import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/services";
import ProductCard from "../../components/products/ProductCard";
import Spinner from "../../components/ui/Spinner";
import "./HomePage.css";

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 8, sort: "-rating" })
      .then(({ data }) => setFeatured(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-inner">
          <h1>
            Shop Smarter.
            <br />
            Pay Faster.
          </h1>
          <p>
            The best products, delivered to your door — powered by MERN &amp;
            Razorpay.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
            <Link
              to="/register"
              className="btn btn-outline"
              style={{ color: "#fff", borderColor: "#fff" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {[
            ["⚡", "Fast Delivery", "Orders shipped within 24 hours"],
            ["🔒", "Secure Payments", "256-bit encryption via Razorpay"],
            ["↩️", "Easy Returns", "Hassle-free 7-day return policy"],
            ["🎯", "Best Prices", "Price-match guarantee on all items"],
          ].map(([icon, title, desc]) => (
            <div key={title} className="feature-card card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Top Rated Products</h2>
            <Link to="/products">View all →</Link>
          </div>
          {loading ? (
            <Spinner center />
          ) : (
            <div className="home-grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
