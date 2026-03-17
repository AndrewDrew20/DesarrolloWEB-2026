import { Link } from "react-router-dom";
import "./OrderConfirmation.css";

const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);

export default function OrderConfirmation() {
  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">✅</div>
        <h1>¡Pedido realizado con éxito!</h1>
        <p className="confirm-subtitle">
          Gracias por tu compra. Tu pedido ha sido recibido y será procesado pronto.
        </p>

        <div className="confirm-detail">
          <span>Número de pedido</span>
          <strong>{orderId}</strong>
        </div>
        <div className="confirm-detail">
          <span>Estado</span>
          <strong className="status-pending">Pendiente de envío</strong>
        </div>
        <div className="confirm-detail">
          <span>Tiempo estimado</span>
          <strong>24 – 48 horas hábiles</strong>
        </div>

        <p className="confirm-email-note">
          Recibirás una confirmación en tu correo electrónico con los detalles del pedido.
        </p>

        <div className="confirm-actions">
          <Link to="/profile" className="btn-my-orders">
            Ver mis pedidos
          </Link>
          <Link to="/catalog" className="btn-continue">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
