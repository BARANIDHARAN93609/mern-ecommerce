import { useState } from "react";
import { useProducts, useCategories } from "../../hooks/useProducts";
import ProductCard from "../../components/products/ProductCard";
import Spinner from "../../components/ui/Spinner";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [params, setParams] = useState({ page: 1, limit: 12, sort: "-createdAt" });
  const [search, setSearch]   = useState("");
  const { products, pagination, loading } = useProducts(params);
  const categories = useCategories();

  const applySearch = (e) => {
    e.preventDefault();
    setParams((p) => ({ ...p, keyword: search, page: 1 }));
  };

  const setCategory = (cat) => setParams((p) => ({ ...p, category: cat || undefined, page: 1, keyword: undefined }));
  const setSort     = (sort) => setParams((p) => ({ ...p, sort, page: 1 }));

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <form className="search-form" onSubmit={applySearch}>
            <input
              className="form-input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="products-layout">
          <aside className="products-sidebar">
            <h3>Categories</h3>
            <ul>
              <li><button className={!params.category ? "active" : ""} onClick={() => setCategory("")}>All</button></li>
              {categories.map((c) => (
                <li key={c}>
                  <button className={params.category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: "1.5rem" }}>Sort by</h3>
            <ul>
              {[
                ["-createdAt", "Newest"],
                ["price",      "Price: Low → High"],
                ["-price",     "Price: High → Low"],
                ["-rating",    "Top Rated"],
              ].map(([val, label]) => (
                <li key={val}>
                  <button className={params.sort === val ? "active" : ""} onClick={() => setSort(val)}>{label}</button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="products-main">
            {loading ? (
              <Spinner center />
            ) : products.length === 0 ? (
              <div className="no-results">No products found</div>
            ) : (
              <>
                <p className="results-count">{pagination.total} products</p>
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {pagination.pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        className={`page-btn ${params.page === pg ? "active" : ""}`}
                        onClick={() => setParams((p) => ({ ...p, page: pg }))}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
