import { useState } from "react";
import { mockProducts as initialProducts } from "../../data/mockProducts";
import { mockCategories } from "../../data/mockCategories";
import "./AdminTable.css";

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", id_category: "", description: "", price: "", stock: "", rating: 3, imageUrl: "" });
  const [search, setSearch] = useState("");

  function formatPrice(price) {
    return "₡" + Number(price).toLocaleString("es-CR");
  }

  function openAdd() {
    setEditing(null);
    setForm({ name: "", id_category: "", description: "", price: "", stock: "", rating: 3, imageUrl: "" });
    setShowForm(true);
  }

  function openEdit(p) {
    setEditing(p._id);
    setForm({ name: p.name, id_category: p.id_category, description: p.description, price: p.price, stock: p.stock, rating: p.rating, imageUrl: p.imageUrl });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (window.confirm("¿Eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p._id === editing ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating) } : p))
      );
    } else {
      const newProduct = { ...form, _id: "prod" + Date.now(), price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating) };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowForm(false);
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Productos</h1>
        <button className="btn-admin-add" onClick={openAdd}>+ Agregar producto</button>
      </div>

      <input className="admin-search" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cat = mockCategories.find((c) => c._id === p.id_category);
              return (
                <tr key={p._id}>
                  <td><img src={p.imageUrl} alt={p.name} style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 5 }} /></td>
                  <td><strong>{p.name}</strong></td>
                  <td>{cat?.name || "—"}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td className={p.stock < 10 ? "low-stock-warn" : ""}>{p.stock}</td>
                  <td>{"★".repeat(p.rating)}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(p._id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Editar producto" : "Agregar producto"}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Nombre<input name="name" value={form.name} onChange={handleChange} required /></label>
              <label>Categoría
                <select name="id_category" value={form.id_category} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {mockCategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </label>
              <label>Descripción<textarea name="description" value={form.description} onChange={handleChange} required rows={3} /></label>
              <div className="form-row-2">
                <label>Precio (₡)<input type="number" name="price" value={form.price} onChange={handleChange} required min={0} /></label>
                <label>Stock<input type="number" name="stock" value={form.stock} onChange={handleChange} required min={0} /></label>
              </div>
              <label>Rating (1-5)<input type="number" name="rating" value={form.rating} onChange={handleChange} min={1} max={5} /></label>
              <label>URL Imagen<input name="imageUrl" value={form.imageUrl} onChange={handleChange} /></label>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-save">{editing ? "Guardar cambios" : "Agregar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
