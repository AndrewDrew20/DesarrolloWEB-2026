import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { mockCategories } from "../data/mockCategories";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const category = mockCategories.find((c) => c._id === product.id_category);

  const stars = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  return (
    <div className="product-card">
      <Link to={`/catalog/${product._id}`}>
        <img src={product.imageUrl} alt={product.name} className="product-card-img" />
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{category?.name}</span>
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
