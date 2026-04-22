import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const CartContext = createContext(null);

// Validar estructura de item del carrito
function isValidCartItem(item) {
  return (
    item &&
    item.product &&
    typeof item.product === "object" &&
    item.product._id &&
    typeof item.product.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

export function CartProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth0();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generar clave de localStorage única por usuario
  const getCartStorageKey = () => {
    if (user?.sub) {
      return `techstore_cart_${user.sub}`;
    }
    return "techstore_cart_anonymous";
  };

  // Cargar carrito desde localStorage al montar o cuando el usuario cambia
  useEffect(() => {
    if (authLoading) {
      // Esperar a que Auth0 termina de cargar
      return;
    }

    try {
      const storageKey = getCartStorageKey();
      const savedCart = localStorage.getItem(storageKey);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          // Filtrar items inválidos
          const validItems = parsedCart.filter(isValidCartItem);
          setItems(validItems);

          // Si había items inválidos, guardar solo los válidos
          if (validItems.length !== parsedCart.length) {
            console.warn(
              "Se encontraron items inválidos en el carrito y fueron eliminados"
            );
            localStorage.setItem(storageKey, JSON.stringify(validItems));
          }
        } else {
          console.warn("CartContext: saved cart is not an array, clearing it");
          setItems([]);
          localStorage.removeItem(storageKey);
        }
      } else {
        // No hay carrito guardado para este usuario, empezar vacío
        setItems([]);
      }
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
      setItems([]);
      try {
        localStorage.removeItem(getCartStorageKey());
      } catch (e) {
        console.error("Could not clear corrupted cart", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    if (!isLoading && !authLoading) {
      try {
        const storageKey = getCartStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (err) {
        console.error("Error saving cart to localStorage:", err);
      }
    }
  }, [items, isLoading, authLoading]);

  function addToCart(product, quantity = 1) {
    // Validar que el producto tenga los campos necesarios
    if (!product || !product._id || typeof product.price !== "number") {
      console.error("Invalid product added to cart:", product);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  // Calcular con validación para evitar errores
  const itemCount = items.reduce((sum, i) => {
    if (isValidCartItem(i)) {
      return sum + i.quantity;
    }
    return sum;
  }, 0);

  const totalPrice = items.reduce((sum, i) => {
    if (isValidCartItem(i)) {
      return sum + (i.product.price * i.quantity || 0);
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
        isLoading: isLoading || authLoading,
        currentUser: user?.sub || null,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}