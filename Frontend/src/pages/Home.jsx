import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const { getCategories, getProducts } = useApi();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Validar que sean arrays
        const products = Array.isArray(productsData) ? productsData : [];
        const cats = Array.isArray(categoriesData) ? categoriesData : [];

        setCategories(cats);

        // Seleccionar 4 productos aleatorios para featured
        if (products.length > 0) {
          const shuffled = [...products].sort(() => Math.random() - 0.5);
          setFeaturedProducts(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los datos. Intenta recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Tecnología al alcance de todos</h1>
          <p>Laptops, periféricos, componentes y más. Envío a todo Costa Rica.</p>
          <Link to="/catalog" className="hero-btn">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Category pills */}
      <section className="category-section">
        <div className="section-inner">
          <h2>Explora por categoría</h2>
          {loading ? (
            <p className="loading-text">Cargando categorías...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : categories.length === 0 ? (
            <p className="empty-text">No hay categorías disponibles.</p>
          ) : (
            <div className="category-pills">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/catalog?category=${cat.name}`}
                  className="pill"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="featured-section">
        <div className="section-inner">
          <h2>Productos destacados</h2>

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
          ) : featuredProducts.length === 0 ? (
            <div className="empty-container">
              <p>No hay productos disponibles en este momento.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {featuredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <div className="see-all-wrap">
                <Link to="/catalog" className="see-all-btn">
                  Ver todos los productos →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Value props */}
      <section className="values-section">
        <div className="section-inner values-grid">
          <div className="value-item">
            <span className="value-icon">🚚</span>
            <h3>Envío rápido</h3>
            <p>Entregas en 24-48 horas a todo el país.</p>
          </div>
          <div className="value-item">
            <span className="value-icon">🔒</span>
            <h3>Compra segura</h3>
            <p>Tus datos protegidos con encriptación.</p>
          </div>
          <div className="value-item">
            <span className="value-icon">↩️</span>
            <h3>Devoluciones</h3>
            <p>30 días para devoluciones sin preguntas.</p>
          </div>
          <div className="value-item">
            <span className="value-icon">🎧</span>
            <h3>Soporte</h3>
            <p>Atención al cliente de lunes a sábado.</p>
          </div>
        </div>
      </section>
    </div>
  );
}