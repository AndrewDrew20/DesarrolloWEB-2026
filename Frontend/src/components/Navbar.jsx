import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { itemCount } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          ⚡ TechStore
        </Link>

        <div className="navbar-links">
          <Link to="/catalog">Productos</Link>
          {currentUser?.role === "admin" && (
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            🛒 {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {currentUser ? (
            <div className="user-menu">
              <Link to="/profile" className="user-name">
                {currentUser.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
