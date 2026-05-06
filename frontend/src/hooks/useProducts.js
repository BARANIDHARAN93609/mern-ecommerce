// useProducts.js
import { useState, useEffect } from "react";
import { fetchProducts, fetchCategories } from "../api/services";

export const useProducts = (params) => {
  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts(params)
      .then(({ data }) => { setProducts(data.data); setPagination(data.pagination); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { products, pagination, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);
  return categories;
};
