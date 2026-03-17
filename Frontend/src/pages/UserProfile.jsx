import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockPurchases } from "../data/mockPurchases";
import { mockProducts } from "../data/mockProducts";
import "./UserProfile.css";

const STATUS_LABELS = {
  pending: { label: "Pendiente", cls: "status-pending" },
  shipped: { label: "En camino", cls: "status-shipped" },
  delivered: { label: "Entregado", cls: "status-delivered" },
};

export default function UserProfile() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  const myPurchases = mockPurchases.filter((p) => p.id_User === currentUser._id);

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-CR", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  return (
    <div className="profile-page">
      <div className="profile-inner">
        {/* User info card */}
        <div className="profile-card">
          <div className="profile-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{currentUser.name}</h1>
            <p className="profile-email">{currentUser.email}</p>
            <span className={`profile-role ${currentUser.role === "admin" ? "role-admin" : "role-user"}`}>
              {currentUser.role === "admin" ? "Administrador" : "Cliente"}
            </span>
          </div>
          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-label">Miembro desde</span>
              <span className="meta-value">{formatDate(currentUser.dateOfCreation)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Total de pedidos</span>
              <span className="meta-value">{myPurchases.length}</span>
            </div>
          </div>
        </div>

        {/* Purchase history */}
        <section className="orders-section">
          <h2>Historial de pedidos</h2>
          {myPurchases.length === 0 ? (
            <div className="no-orders">Aún no tienes pedidos registrados.</div>
          ) : (
            <div className="orders-list">
              {myPurchases.map((purchase) => {
                const product = mockProducts.find((p) => p._id === purchase.id_Product);
                const st = STATUS_LABELS[purchase.status] || { label: purchase.status, cls: "" };
                return (
                  <div key={purchase._id} className="order-card">
                    <div className="order-img-wrap">
                      {product && <img src={product.imageUrl} alt={product.name} />}
                    </div>
                    <div className="order-details">
                      <p className="order-desc">{purchase.description}</p>
                      <p className="order-address">📍 {purchase.shippingAddress}</p>
                    </div>
                    <div className="order-right">
                      <span className={`order-status ${st.cls}`}>{st.label}</span>
                      <strong className="order-price">{formatPrice(purchase.totalPrice)}</strong>
                      <span className="order-id">#{purchase._id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
