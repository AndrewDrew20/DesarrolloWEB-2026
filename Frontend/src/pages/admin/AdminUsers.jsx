import { useState } from "react";
import { mockUsers } from "../../data/mockUsers";
import "./AdminTable.css";

export default function AdminUsers() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-CR");
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Usuarios</h1>
      </div>

      <input
        className="admin-search"
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Miembro desde</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="user-avatar-mini">{u.name.charAt(0)}</div>
                </td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                    {u.role === "admin" ? "Admin" : "Cliente"}
                  </span>
                </td>
                <td>{formatDate(u.dateOfCreation)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
