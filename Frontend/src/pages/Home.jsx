import { Link } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const featured = mockProducts.slice(0, 4);

export default function Home() {
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
          <div className="category-pills">
            {["Laptops","Periféricos","Componentes","Accesorios","Móviles"].map((cat) => (
              <Link key={cat} to={`/catalog?category=${cat}`} className="pill">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="featured-section">
        <div className="section-inner">
          <h2>Productos destacados</h2>
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="see-all-wrap">
            <Link to="/catalog" className="see-all-btn">
              Ver todos los productos →
            </Link>
          </div>
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
            <p>Tus datos protegidos con encriptación SSL.</p>
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
