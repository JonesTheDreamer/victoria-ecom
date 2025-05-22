import React, { useState, useEffect } from "react";
import { useProduct } from "../contexts/ProductContext";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const EmployeeEditProduct = () => {
  const { productId } = useParams();
  const { getProduct, updateProduct } = useProduct();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("token") === "" ||
      sessionStorage.getItem("role") === null ||
      sessionStorage.getItem("role") !== "EMPLOYEE"
    ) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProduct(productId);
      console.log(fetchedProduct.data);

      setProduct(fetchedProduct.data);
      setName(fetchedProduct.data.name);
      setDescription(fetchedProduct.data.description);
      setPrice(fetchedProduct.data.price);
      setStock(fetchedProduct.data.stock);
      setImagePreview(fetchedProduct.data.imageObj);
    };

    fetchProduct();
  }, [productId, getProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveUpdates = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (image) {
      formData.append("image", image);
    }
    formData.append("_method", "PUT");

    await updateProduct(productId, formData);
    alert("Product updated successfully!");
    navigate("/employee");
  };

  return (
    <>
      <Sidebar />
      <div className="p-5 w-full">
        {product ? (
          <div className="flex flex-wrap bg-white p-6 shadow-md rounded-md">
            <div className="w-full lg:w-2/3 pr-8">
              <h2 className="text-2xl font-[Roboto] mb-5">Edit Product</h2>

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
                  onClick={handleSaveUpdates}
                  className="bg-[#d5c58a] text-white px-8 py-3 rounded-md"
                >
                  Save Updates
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/3 mt-5 lg:mt-0">
              {imagePreview && (
                <div className="flex flex-col justify-center">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-[Roboto]">
                      Product Image
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full px-4 py-2 mt-2 border rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </>
  );
};

export default EmployeeEditProduct;
