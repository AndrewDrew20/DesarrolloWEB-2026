import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import "./AdminTable.css";

const STATUSES = ["pending", "shipped", "delivered"];
const STATUS_LABELS = { pending: "Pendiente", shipped: "En camino", delivered: "Entregado" };
const STATUS_CLS = { pending: "status-pending", shipped: "status-shipped", delivered: "status-delivered" };

export default function AdminOrders() {
  const { authFetch } = useApi();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    authFetch('/purchases').then(setOrders).catch(console.error);
    authFetch('/products').then(setProducts).catch(console.error);
    authFetch('/users').then(setUsers).catch(console.error);
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    await authFetch(`/purchases/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
  }

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Pedidos</h1>
        <div className="filter-tabs">
          {["all", ...STATUSES].map(s => (
            <button key={s} className={`filter-tab ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>
              {s === "all" ? "Todos" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Cliente</th><th>Dirección</th><th>Total</th><th>Estado</th><th>Cambiar estado</th></tr>
          </thead>
          <tbody>
            {filtered.map(order => {
              const product = products.find(p => p._id === order.id_Product);
              const user = users.find(u => u._id === order.id_User);
              return (
                <tr key={order._id}>
                  <td className="monospace">#{order._id}</td>
                  <td>
                    <div className="product-mini">
                      {product && <img src={product.imageUrl} alt={product.name} />}
                      <span>{product?.name || "—"}</span>
                    </div>
                  </td>
                  <td>{user?.name || "—"}</td>
                  <td className="small-text">{order.shippingAddress}</td>
                  <td>{formatPrice(order.totalPrice)}</td>
                  <td><span className={`badge ${STATUS_CLS[order.status]}`}>{STATUS_LABELS[order.status]}</span></td>
                  <td>
                    <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className="status-select">
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}