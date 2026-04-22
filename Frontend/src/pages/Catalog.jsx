import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import ProductCard from "../components/ProductCard";
import "./Catalog.css";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "Todos";

  const { getCategories, getProducts } = useApi();

  // Estados para datos
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar y ordenar productos
  const filtered = useMemo(() => {
    let list = [...products];

    // Filtrar por categoría
    if (selectedCategory !== "Todos") {
      const cat = categories.find((c) => c.name === selectedCategory);
      if (cat) {
        list = list.filter((p) => p.id_category === cat._id);
      }
    }

    // Filtrar por búsqueda
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Ordenar
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, selectedCategory, sortBy, products, categories]);

  return (
    <div className="catalog-page">
      <div className="catalog-inner">
        {/* Sidebar */}
        <aside className="catalog-sidebar">
          <h3>Categorías</h3>
          {loading ? (
            <p className="loading-text">Cargando categorías...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <ul className="cat-list">
              {["Todos", ...categories.map((c) => c.name)].map((cat) => (
                <li key={cat}>
                  <button
                    className={`cat-btn ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
              disabled={loading}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              disabled={loading}
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-container">
              <p>Cargando productos...</p>
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Recargar página
              </button>
            </div>
          ) : (
            <>
              <p className="result-count">
                {filtered.length} producto(s) encontrado(s)
              </p>

              {filtered.length === 0 ? (
                <div className="no-results">No se encontraron productos.</div>
              ) : (
                <div className="products-grid">
                  {filtered.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}