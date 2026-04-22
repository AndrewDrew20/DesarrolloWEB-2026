import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import "./AdminDashboard.css";

const STATUS_MAP = {
  pending: { label: "Pendiente", cls: "status-pending" },
  shipped: { label: "En camino", cls: "status-shipped" },
  delivered: { label: "Entregado", cls: "status-delivered" },
};

export default function AdminDashboard() {
  const { getProducts, getCategories } = useApi();

  // Estados
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Nota: Para purchases y users, necesitarás agregar métodos a useApi
        // Por ahora usamos arrays vacíos como fallback
        setPurchases([]);
        setUsers([]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("No se pudieron cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular métricas
  const totalRevenue = purchases.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock < 10);
  const recentOrders = purchases.slice(-3).reverse();

  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1>Dashboard</h1>
        <div className="loading-container">
          <p>Cargando datos...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <h1>Dashboard</h1>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="dash-subtitle">Bienvenido al panel de administración de SmartZone.</p>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-num">{products.length}</p>
            <p className="stat-label">Productos</p>
          </div>
          <Link to="/admin/products" className="stat-link">Ver →</Link>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🏷️</span>
          <div>
            <p className="stat-num">{categories.length}</p>
            <p className="stat-label">Categorías</p>
          </div>
          <Link to="/admin/categories" className="stat-link">Ver →</Link>
        </div>

      
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <section className="recent-orders">
          <div className="section-header">
            <h2>Pedidos recientes</h2>
            <Link to="/admin/orders" className="see-all">Ver todos</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const st = STATUS_MAP[order.status] || { 
                    label: order.status, 
                    cls: "" 
                  };
                  return (
                    <tr key={order._id}>
                      <td className="monospace">#{order._id}</td>
                      <td>{order.description}</td>
                      <td>{formatPrice(order.totalPrice)}</td>
                      <td>
                        <span className={`badge ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Low stock */}
      {lowStockProducts.length > 0 && (
        <section className="low-stock">
          <h2>Stock bajo (&lt; 10 unidades)</h2>
          <div className="low-stock-list">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="low-stock-item">
                <img 
                  src={p.imageUrl} 
                  alt={p.name}
                  loading="lazy"
                />
                <span>{p.name}</span>
                <span className="stock-num">{p.stock} uds.</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {products.length === 0 && categories.length === 0 && (
        <div className="empty-state">
          <p>No hay datos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
}