import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { getCategories } = useApi();
  const [categoryName, setCategoryName] = useState("");

  // Obtener nombre de la categoría
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await getCategories();
        const cat = categories.find((c) => c._id === product.id_category);
        if (cat) setCategoryName(cat.name);
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };

    fetchCategory();
  }, [product.id_category]);

  const stars = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  return (
    <div className="product-card">
      <Link to={`/catalog/${product._id}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-card-img"
          loading="lazy"
        />
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{categoryName}</span>
        <Link to={`/catalog/${product._id}`} className="product-card-name">
          {product.name}
        </Link>
        <div className="product-card-rating">{stars}</div>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <button
            className="btn-add-cart"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Agregar" : "Agotado"}
          </button>
        </div>
      </div>
    </div>
  );
}