import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading) return <p className="p-4">Loading product details...</p>;
  if (!product) return <p className="p-4">Product not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link to="/" className="text-[#006A71] underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <div className="p-10 border border-[#006A71] rounded-xl shadow bg-[#C7D9DD]">
        <img
          src={product.image_front_url || "https://via.placeholder.com/300"}
          alt={product.product_name}
          className="w-full h-64 object-contain mb-4 rounded"
        />
        <h1 className="text-2xl font-bold mb-2">
          {product.product_name || "Unnamed Product"}
        </h1>
        <p className="mb-2 text-gray-700">
          {" "}
          <strong className="text-black">Brand:</strong>{" "}
          {product.brands || "N/A"}
        </p>
        <p className="mb-2 text-gray-700">
          <strong className="text-black">Category:</strong>{" "}
          {product.categories || "N/A"}
        </p>
        <p className="mb-2 text-gray-700">Labels: {product.labels || "N/A"}</p>
        <p className="mb-4">
          <strong>Ingredients:</strong>
          <br /> {product.ingredients_text || "No ingredients listed"}
        </p>

        <h2 className="text-xl font-semibold mb-2">
          Nutritional Values (per 100g)
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Energy: {product.nutriments?.energy_100g || "N/A"} kJ</li>
          <li>Fat: {product.nutriments?.fat_100g || "N/A"} g</li>
          <li>
            Carbohydrates: {product.nutriments?.carbohydrates_100g || "N/A"} g
          </li>
          <li>Proteins: {product.nutriments?.proteins_100g || "N/A"} g</li>
          <li>Salt: {product.nutriments?.salt_100g || "N/A"} g</li>
          <li>Sugars: {product.nutriments?.sugars_100g || "N/A"} g</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;
