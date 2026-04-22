import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserSync } from "../hooks/useUserSync";
import "./UserProfile.css";

const STATUS_LABELS = {
  pending: { label: "Pendiente", cls: "status-pending" },
  shipped: { label: "En camino", cls: "status-shipped" },
  delivered: { label: "Entregado", cls: "status-delivered" },
};

export default function UserProfile() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  useUserSync();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-CR", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  return (
    <div className="profile-page">
      <div className="profile-inner">
        <div className="profile-card">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
    
        </div>

      </div>
    </div>
  );
}