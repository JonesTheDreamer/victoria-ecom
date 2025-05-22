// App.jsx

import { useContext, useEffect, useState } from "react";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllProducts } = useProduct();
  const { createCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const heroProduct =
    products.length > 0 ? products[products.length - 1] : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsResponse = await getAllProducts();
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async () => {
    if (token && heroProduct) {
      try {
        await createCart({ product_id: heroProduct.id, quantity: 1 });
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setFilteredProducts(products);
    } else {
      const searchTermLower = e.target.value.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTermLower)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-6 bg-[#f7f7f7] overflow-auto flex-1">
        <h1 className="text-2xl mb-6">Built for quality, built to last</h1>
        <div className="mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
          />
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-8">
            {heroProduct && (
              <div className="bg-[#d5c58a] text-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center space-x-6">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="w-64 h-64 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-3xl font-semibold">
                      {heroProduct.name}
                    </h2>
                    <p className="text-lg text-gray-200 mt-2">
                      {heroProduct.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold">
                        ₱{heroProduct.price}
                      </span>
                      <span className="text-sm text-gray-200">
                        Stock: {heroProduct.stock}
                      </span>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-2xl"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Customer;
