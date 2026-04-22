import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span>SmartZone</span>
          <p>Tu tienda de tecnología de confianza en Costa Rica.</p>
        </div>
        <div className="footer-links">
          <h4>Categorías</h4>
          <ul>
            <li>Laptops</li>
            <li>Periféricos</li>
            <li>Componentes</li>
            <li>Accesorios</li>
            <li>Móviles</li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Información</h4>
          <ul>
            <li>Sobre nosotros</li>
            <li>Política de devoluciones</li>
            <li>Términos y condiciones</li>
            <li>Contacto</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 TechStore — ULACIT Desarrollo Web</p>
      </div>
    </footer>
  );
}
