import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");

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
      if (sortOrder === "asc") {
        newProducts.sort((a, b) =>
          (a.product_name || "").localeCompare(b.product_name || "")
        );
      } else if (sortOrder === "desc") {
        newProducts.sort((a, b) =>
          (b.product_name || "").localeCompare(a.product_name || "")
        );
      }

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
    <div className="p-4 text-[#09122C] min-h-screen mx-auto bg-[#9ACBD0]">
      <div className="flex items-center justify-center py-5">
        <h1 className="text-4xl  font-bold mb-4">Food Product Explorer</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-10 mt-5 flex gap-2">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2  flex-1 rounded"
        />
        <button
          type="submit"
          className="bg-[#006A71] text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>
      <div className="mb-10 mt-10 flex gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSearchTerm("");
            setPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="">Default</option>
          <option value="asc">Name A-Z</option>
          <option value="desc">Name Z-A</option>
        </select>
      </div>

      {loading && page === 1 ? (
        <p>Wait a mintue...</p>
      ) : (
        <div className="grid md:grid-cols-5 gap-5">
          {products.map((product) => (
            <Link to={`/product/${product.code}`} key={product.code}>
              <div className=" bg-[#C7D9DD] max-w-96 min-h-96 rounded p-4 shadow hover:shadow-lg transition cursor">
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
                <div className="flex items-center justify-center mt-10">
                  <button className="bg-[#006A71] min-w-full text-white px-4 py-2 rounded cursor-pointer">
                    See Product
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-[#006A71] text-white px-6 py-2 rounded"
        >
          {loading && page > 1 ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default Home;
