import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import "./Cart.css";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  function handleCheckout() {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      navigate("/checkout");
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛒</span>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para comenzar tu compra.</p>
        <Link to="/catalog" className="btn-go-catalog">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <h1>Carrito de compras</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="cart-item">
                <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <Link to={`/catalog/${product._id}`} className="cart-item-name">
                    {product.name}
                  </Link>
                  <p className="cart-item-unit">{formatPrice(product.price)} c/u</p>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQuantity(product._id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                </div>
                <span className="cart-item-subtotal">
                  {formatPrice(product.price * quantity)}
                </span>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(product._id)}
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="btn-clear" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>

          <div className="cart-summary">
            <h2>Resumen</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span className="free-ship">Gratis</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              {isAuthenticated ? "Proceder al pago" : "Iniciar sesión para comprar"}
            </button>
            <Link to="/catalog" className="continue-shopping">
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}