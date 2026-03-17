import { useState, useEffect } from "react";
import "./AdminTable.css";

const BASE_URL = 'http://localhost:3000';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    fetch(`${BASE_URL}/categories`).then(r => r.json()).then(setCategories).catch(console.error);
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowForm(true);
  }

  function openEdit(c) {
    setEditing(c._id);
    setForm({ name: c.name, description: c.description });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (window.confirm("¿Eliminar esta categoría?")) {
      await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c._id !== id));
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      const updated = await fetch(`${BASE_URL}/categories/${editing}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(r => r.json());
      setCategories(prev => prev.map(c => c._id === editing ? updated : c));
    } else {
      const created = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(r => r.json());
      setCategories(prev => [...prev, created]);
    }
    setShowForm(false);
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Categorías</h1>
        <button className="btn-admin-add" onClick={openAdd}>+ Agregar categoría</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.description}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => openEdit(c)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(c._id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? "Editar categoría" : "Agregar categoría"}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Nombre<input name="name" value={form.name} onChange={handleChange} required /></label>
              <label>Descripción<textarea name="description" value={form.description} onChange={handleChange} required rows={3} /></label>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-save">{editing ? "Guardar" : "Agregar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}