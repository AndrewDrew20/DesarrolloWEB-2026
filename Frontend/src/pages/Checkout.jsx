import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import "./Checkout.css";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    province: "",
    phone: "",
    paymentMethod: "card",
  });

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearCart();
    navigate("/order-confirmation");
  }

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1>Finalizar compra</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <h2>Información de envío</h2>
              <div className="form-row">
                <label>
                  Nombre completo
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Juan Pérez"
                  />
                </label>
                <label>
                  Correo electrónico
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </label>
              </div>
              <label>
                Dirección de envío
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Calle, número, edificio..."
                />
              </label>
              <div className="form-row">
                <label>
                  Ciudad
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="San José"
                  />
                </label>
                <label>
                  Provincia
                  <select name="province" value={form.province} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {["San José","Alajuela","Cartago","Heredia","Guanacaste","Puntarenas","Limón"].map(
                      (p) => <option key={p} value={p}>{p}</option>
                    )}
                  </select>
                </label>
              </div>
              <label>
                Teléfono
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="8888-8888"
                />
              </label>
            </section>

            <section className="form-section">
              <h2>Método de pago</h2>
              <div className="payment-options">
                {[
                  { value: "card", label: "💳 Tarjeta de crédito/débito" },
                  { value: "sinpe", label: "📱 SINPE Móvil" },
                  { value: "transfer", label: "🏦 Transferencia bancaria" },
                ].map(({ value, label }) => (
                  <label key={value} className={`payment-option ${form.paymentMethod === value ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={form.paymentMethod === value}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {form.paymentMethod === "card" && (
                <div className="card-fields">
                  <label>
                    Número de tarjeta
                    <input placeholder="1234 5678 9012 3456" maxLength={19} />
                  </label>
                  <div className="form-row">
                    <label>
                      Vencimiento
                      <input placeholder="MM/AA" maxLength={5} />
                    </label>
                    <label>
                      CVV
                      <input placeholder="123" maxLength={4} type="password" />
                    </label>
                  </div>
                </div>
              )}
              {form.paymentMethod === "sinpe" && (
                <div className="sinpe-info">
                  <p>Envía tu pago al número <strong>8888-8888</strong> y adjunta el comprobante.</p>
                </div>
              )}
            </section>

            <button type="submit" className="btn-place-order">
              Realizar pedido — {formatPrice(totalPrice)}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Tu pedido</h2>
            <div className="checkout-items">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="checkout-item">
                  <img src={product.imageUrl} alt={product.name} />
                  <div>
                    <p>{product.name}</p>
                    <span>× {quantity}</span>
                  </div>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="totals-row">
                <span>Subtotal</span><span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="totals-row">
                <span>Envío</span><span className="free">Gratis</span>
              </div>
              <div className="totals-row total">
                <span>Total</span><span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}