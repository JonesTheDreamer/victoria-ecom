import React, { useState } from "react";
import { useProduct } from "../contexts/ProductContext";
import Sidebar from "../components/Sidebar";

const EmployeeAddProduct = () => {
  const { createProduct } = useProduct();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async () => {
    if (parseFloat(price) < 0 || parseInt(stock) < 0) {
      setError("Price and stock cannot be less than 0.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (image) {
      formData.append("image", image);
    }

    try {
      await createProduct(formData);
      alert("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage(null);
      setImagePreview("");
    } catch (error) {
      setError("Failed to add product. Please try again.");
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="w-full p-5 bg-[#f7f7f7]">
        <div className="bg-white p-6 shadow-md rounded-md flex flex-wrap">
          <div className="w-full lg:w-2/3 pr-8">
            <h2 className="text-2xl font-[Roboto] mb-2">Add New Product</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-4">
              <label className="block text-sm font-[Roboto]">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-[Roboto]">
                Product Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-[Roboto]">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-[Roboto]">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleSaveProduct}
                className="bg-[#d5c58a] text-white px-8 py-3 rounded-md"
              >
                Save Product
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/3 mt-5 lg:mt-0">
            <div
              className={`w-full h-32 border-dashed border-4 border-gray-300 rounded-md flex justify-center items-center ${
                !image && "text-gray-500"
              }`}
            >
              {!image ? (
                <p className="text-center">Upload Product Image</p>
              ) : (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>

            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeAddProduct;
