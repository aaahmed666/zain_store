import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initialProducts } from "./initialProducts";
import logo from "./assets/zain_logo.jpg";

const ProductManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const initialProduct = JSON.parse(localStorage.getItem("products"));

  const [products, setProducts] = useState(initialProduct || initialProducts);
  const [bottlePrice, setBottlePrice] = useState(2.25);
  const [stickerPrice, setStickerPrice] = useState(20 / 35);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    if (!newProductName || !newProductPrice) return;

    const newProduct = {
      id: products.length + 1,
      name: newProductName,
      pricePerKg: parseFloat(newProductPrice),
    };

    const updatedProducts = [...products, newProduct];

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setNewProductName("");
    setNewProductPrice("");
  };

  const handlePriceChange = (id, newPrice) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, pricePerKg: newPrice } : product
    );

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const roundToNearestHalf = (value) => {
    return Math.ceil(value * 2) / 2; // Always rounds up to nearest 0.5
  };

  const calculatePrice = (basePrice) => {
    const totalCost = basePrice + bottlePrice + stickerPrice; // Base cost with additional costs
    const finalPricePerKg = roundToNearestHalf(totalCost * 1.25); // Adding 25% profit margin and rounding

    const price40g = roundToNearestHalf((finalPricePerKg / 1000) * 40); // 40g with profit
    const price90g = roundToNearestHalf((finalPricePerKg / 1000) * 90); // 90g with profit

    return { price40g, price90g, finalPrice: finalPricePerKg };
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center my-4">
        <img
          src={logo}
          alt="Zain Store Logo"
          style={{ height: "120px", objectFit: "cover" }} // Reduced size for mobile
        />
        <h2 className="text-center my-3 my-md-0">ادارة المنتجات</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          تسجيل خروج
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-2">
          <label className="form-label">سعر العلبة</label>
          <input
            type="number"
            value={bottlePrice}
            className="form-control"
            onChange={(e) => setBottlePrice(parseFloat(e.target.value))}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">سعر الاستيكر الواحد</label>
          <input
            type="number"
            value={stickerPrice}
            className="form-control"
            onChange={(e) => setStickerPrice(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="mb-4">
        <h4>إضافة منتج جديد</h4>
        <div className="d-flex flex-column flex-md-row gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="اسم المنتج"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="السعر (1kg)"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={addProduct}
          >
            إضافة
          </button>
        </div>
      </div>

      {/* Table wrapper for mobile scrolling */}
      <div
        className="table-responsive"
        style={{ overflowX: "auto" }}
      >
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>المنتج</th>
              <th>سعر (1kg)</th>
              <th>سعر (40g)</th> {/* Updated from 50g to 40g */}
              <th>سعر (90g)</th> {/* Updated from 100g to 90g */}
              <th>السعر النهائي</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const { price40g, price90g, finalPrice } = calculatePrice(
                product.pricePerKg
              );
              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={product.pricePerKg}
                      className="form-control"
                      style={{ minWidth: "60px" }}
                      onChange={(e) =>
                        handlePriceChange(
                          product.id,
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>{price40g.toFixed(2)}</td> {/* Updated */}
                  <td>{price90g.toFixed(2)}</td> {/* Updated */}
                  <td>{finalPrice.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProduct(product.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManager;
