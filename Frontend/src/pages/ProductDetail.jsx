import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById, getProducts, getCategories } = useApi();

  // Estados
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Cargar producto y datos relacionados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener producto por ID
        const productData = await getProductById(id);
        
        if (!productData) {
          setError("Producto no encontrado");
          return;
        }

        setProduct(productData);

        // Obtener categoría del producto
        const categoriesData = await getCategories();
        const foundCategory = categoriesData.find(
          (c) => c._id === productData.id_category
        );
        setCategory(foundCategory);

        // Obtener productos relacionados (misma categoría)
        const allProducts = await getProducts();
        const related = allProducts
          .filter(
            (p) =>
              p.id_category === productData.id_category && p._id !== productData._id
          )
          .slice(0, 3);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("No se pudo cargar el producto. Intenta recargar la página.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handler para agregar al carrito
  function handleAddToCart() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // Formatear precio
  function formatPrice(price) {
    return "₡" + price.toLocaleString("es-CR");
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-inner">
          <div className="loading-container">
            <p>Cargando producto...</p>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !product) {
    return (
      <div className="detail-page">
        <div className="detail-inner">
          <div className="detail-not-found">
            <h2>{error || "Producto no encontrado"}</h2>
            <Link to="/catalog">← Volver al catálogo</Link>
          </div>
        </div>
      </div>
    );
  }

  // Generar estrellas
  const stars = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);

  return (
    <div className="detail-page">
      <div className="detail-inner">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link> / <Link to="/catalog">Catálogo</Link> /{" "}
          <span>{product.name}</span>
        </nav>

        <div className="detail-layout">
          {/* Image */}
          <div className="detail-image-wrap">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="detail-image"
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-category">{category?.name || "Sin categoría"}</span>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating">
              <span className="stars">{stars}</span>
              <span className="rating-num">{product.rating}/5</span>
            </div>
            <p className="detail-price">{formatPrice(product.price)}</p>
            <p className="detail-desc">{product.description}</p>

            <div className="detail-stock">
              {product.stock > 0 ? (
                <span className="in-stock">
                  ✓ En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="out-stock">✗ Agotado</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="detail-actions">
                <div className="qty-control">
                  <button 
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button 
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <button className="btn-add" onClick={handleAddToCart}>
                  {added ? "¡Agregado! ✓" : "Agregar al carrito"}
                </button>
                <button
                  className="btn-buy"
                  onClick={() => {
                    addToCart(product, qty);
                    navigate("/cart");
                  }}
                >
                  Comprar ahora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-section">
            <h2>También te puede interesar</h2>
            <div className="related-grid">
              {relatedProducts.map((p) => (
                <Link key={p._id} to={`/catalog/${p._id}`} className="related-card">
                  <img src={p.imageUrl} alt={p.name} />
                  <p>{p.name}</p>
                  <strong>{formatPrice(p.price)}</strong>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}