import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import { mockCategories } from "../data/mockCategories";
import ProductCard from "../components/ProductCard";
import "./Catalog.css";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "Todos";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let list = [...mockProducts];

    if (selectedCategory !== "Todos") {
      const cat = mockCategories.find((c) => c.name === selectedCategory);
      if (cat) list = list.filter((p) => p.id_category === cat._id);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="catalog-page">
      <div className="catalog-inner">
        {/* Sidebar */}
        <aside className="catalog-sidebar">
          <h3>Categorías</h3>
          <ul className="cat-list">
            {["Todos", ...mockCategories.map((c) => c.name)].map((cat) => (
              <li key={cat}>
                <button
                  className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="catalog-main">
          <div className="catalog-toolbar">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>

          <p className="result-count">{filtered.length} producto(s) encontrado(s)</p>

          {filtered.length === 0 ? (
            <div className="no-results">No se encontraron productos.</div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
