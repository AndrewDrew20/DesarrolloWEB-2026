import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import "./AdminTable.css";

export default function AdminUsers() {
  const { authFetch } = useApi();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    authFetch('/users').then(setUsers).catch(console.error);
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Usuarios</h1>
      </div>

      <input className="admin-search" placeholder="Buscar por nombre o correo..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Avatar</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td><div className="user-avatar-mini">{u.name?.charAt(0)}</div></td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                    {u.role === "admin" ? "Admin" : "Cliente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}