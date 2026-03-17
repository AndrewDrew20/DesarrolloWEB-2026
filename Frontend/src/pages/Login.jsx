import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockUsers } from "../data/mockUsers";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [selectedId, setSelectedId] = useState("");

  if (currentUser) {
    navigate(from, { replace: true });
    return null;
  }

  function handleLogin(e) {
    e.preventDefault();
    const user = mockUsers.find((u) => u._id === selectedId);
    if (user) {
      login(user);
      navigate(from, { replace: true });
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">⚡</span>
          <h1>TechStore</h1>
          <p>Selecciona un usuario para simular el inicio de sesión</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="user-options">
            {mockUsers.map((user) => (
              <label
                key={user._id}
                className={`user-option ${selectedId === user._id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="user"
                  value={user._id}
                  checked={selectedId === user._id}
                  onChange={() => setSelectedId(user._id)}
                />
                <div className="user-option-avatar">
                  {user.name.charAt(0)}
                </div>
                <div className="user-option-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span className={`role-tag ${user.role}`}>{user.role === "admin" ? "Administrador" : "Cliente"}</span>
                </div>
              </label>
            ))}
          </div>

          <button type="submit" className="btn-login-submit" disabled={!selectedId}>
            Iniciar sesión
          </button>
        </form>

        <p className="login-note">
          ⚙️ Entorno de desarrollo — la autenticación real usará Auth0.
        </p>
      </div>
    </div>
  );
}
