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

    setProducts([...products, newProduct]);

    setNewProductName("");
    setNewProductPrice("");
  };

  const handlePriceChange = (id, newPrice) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, pricePerKg: newPrice } : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const roundToNearestHalf = (value) => Math.ceil(value * 2) / 2;

  const calculatePrice = (basePrice) => {
    const totalCost = basePrice + bottlePrice * 25 + stickerPrice * 25;
    const finalPricePerKg = roundToNearestHalf(totalCost * 1.25); // Adding 25% profit margin

    return {
      price40g: roundToNearestHalf((finalPricePerKg / 1000) * 40),
      price90g: roundToNearestHalf((finalPricePerKg / 1000) * 90),
      finalPrice: finalPricePerKg,
      price50gNoProfit: (basePrice / 1000) * 40,
      price90gNoProfit: (basePrice / 1000) * 90,
    };
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center my-4">
        <img
          src={logo}
          alt="Zain Store Logo"
          style={{ height: "120px", objectFit: "cover" }}
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
            onChange={(e) => setBottlePrice(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">سعر الاستيكر الواحد</label>
          <input
            type="number"
            value={stickerPrice}
            className="form-control"
            onChange={(e) => setStickerPrice(parseFloat(e.target.value) || 0)}
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
              <th>سعر (40g بدون ربح)</th>
              <th>سعر (90g بدون ربح)</th>
              <th>سعر (40g)</th>
              <th>سعر (90g)</th>
              <th>السعر النهائي</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const {
                price40g,
                price90g,
                finalPrice,
                price50gNoProfit,
                price90gNoProfit,
              } = calculatePrice(product.pricePerKg);
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
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td>{price50gNoProfit.toFixed(2)}</td>
                  <td>{price90gNoProfit.toFixed(2)}</td>
                  <td>{price40g.toFixed(2)}</td>
                  <td>{price90g.toFixed(2)}</td>
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
