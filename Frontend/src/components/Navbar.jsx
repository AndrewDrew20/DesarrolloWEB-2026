import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../hooks/useUserRole';

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const role = useUserRole();
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();

  function handleLogout() {
    logout({ logoutParams: { returnTo: window.location.origin } });
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
          {role === 'admin' && (
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            🛒 {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {!isLoading && !isAuthenticated && (
            <button className="btn-login" onClick={() => loginWithRedirect()}>
              Iniciar sesión
            </button>
          )}

          {!isLoading && isAuthenticated && (
            <div className="user-menu">
              <Link to="/profile" className="user-name">
                {user?.name?.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}