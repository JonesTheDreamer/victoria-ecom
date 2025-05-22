// ProductCard.js

import { useContext } from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { createCart } = useCart();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (token) {
      try {
        await createCart({ product_id: product.id, quantity: 1 });
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{product.name}</h2>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[#d5c58a] font-bold">₱{product.price}</span>
          <span className="text-sm text-gray-400">Stock: {product.stock}</span>
        </div>
        <p className="italic">{product.description}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-green-500 text-white px-2 py-1 rounded-2xl"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
