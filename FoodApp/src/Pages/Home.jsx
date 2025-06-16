import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProducts = async (isSearch = false) => {
    setLoading(true);
    try {
      let url = "";

      if (searchTerm) {
        url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&page=${page}&json=true`;
      } else if (selectedCategory) {
        url = `https://world.openfoodfacts.org/category/${selectedCategory}.json`;
      } else {
        url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=snacks&page=${page}&json=true`;
      }

      const res = await fetch(url);
      const data = await res.json();
      const newProducts = data.products || [];

      setProducts((prev) =>
        isSearch || page === 1 || selectedCategory
          ? newProducts
          : [...prev, ...newProducts]
      );
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://world.openfoodfacts.org/categories.json"
        );
        const data = await res.json();
        const categoryList = data.tags.slice(0, 50);
        setCategories(categoryList);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(searchTerm !== "");
    // eslint-disable-next-line
  }, [page, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(true);
  };

  return (
    <div className="p-4 min-h-screen mx-auto bg-white">
      <h1 className="text-3xl font-bold mb-4">Food Product Explorer</h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      <div className="mb-4">
        <label className="font-medium mr-2">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSearchTerm("");
            setPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- All Categories --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading && page === 1 ? (
        <p>Wait a mintue...</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link to={`/product/${product.code}`} key={product.code}>
              <div className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer">
                <img
                  src={
                    product.image_front_small_url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={product.product_name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h2 className="font-semibold text-lg mb-1">
                  {product.product_name || "Unnamed Product"}
                </h2>
                <p className="text-sm text-gray-600">
                  Category:{" "}
                  {product.categories_tags?.[0]?.replace("en:", "") || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Nutrition Grade: {product.nutrition_grades || "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading && page > 1 ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default Home;
