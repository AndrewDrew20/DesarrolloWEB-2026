import { useAuth0 } from '@auth0/auth0-react';

const BASE_URL = 'http://localhost:3000';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Fetch con autenticación (para rutas protegidas)
  const authFetch = async (endpoint, options = {}) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fetch sin autenticación (para rutas públicas)
  const publicFetch = async (endpoint, options = {}) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // ========== PRODUCTOS (PÚBLICOS) ==========

  // Obtener todos los productos (sin autenticación)
  const getProducts = async () => {
    return publicFetch('/products');
  };

  // Obtener un producto por ID (sin autenticación)
  const getProductById = async (id) => {
    return publicFetch(`/products/${id}`);
  };

  // Obtener productos por categoría (sin autenticación)
  const getProductsByCategory = async (categoryId) => {
    return publicFetch(`/products?id_category=${categoryId}`);
  };

  // ========== CATEGORÍAS (PÚBLICAS) ==========

  // Obtener todas las categorías (sin autenticación)
  const getCategories = async () => {
    return publicFetch('/categories');
  };

  // ========== PRODUCTOS (ADMIN - PROTEGIDOS) ==========

  // Crear un nuevo producto (requiere autenticación)
  const createProduct = async (productData) => {
    return authFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  };

  // Actualizar un producto (requiere autenticación)
  const updateProduct = async (id, productData) => {
    return authFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  };

  // Eliminar un producto (requiere autenticación)
  const deleteProduct = async (id) => {
    return authFetch(`/products/${id}`, {
      method: 'DELETE',
    });
  };

  // ========== COMPRAS (PROTEGIDAS) ==========

  // Crear una compra
  const createPurchase = async (purchaseData) => {
    return authFetch('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  };

  // Obtener compras del usuario actual
  const getUserPurchases = async () => {
    return authFetch('/purchases/my');
  };

  // Obtener una compra por ID
  const getPurchaseById = async (id) => {
    return authFetch(`/purchases/${id}`);
  };

  // ========== USUARIOS (PROTEGIDAS) ==========

  // Obtener perfil del usuario actual
  const getCurrentUser = async () => {
    return authFetch('/users/me');
  };

  // Actualizar perfil del usuario
  const updateCurrentUser = async (userData) => {
    return authFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  };

  // Sincronizar usuario con Auth0
  const syncUser = async (userData) => {
    return authFetch('/users/sync', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  // ========== ADMIN - USUARIOS (PROTEGIDAS) ==========

  // Obtener todos los usuarios (admin only)
  const getUsers = async () => {
    return authFetch('/users');
  };

  // Obtener un usuario por ID (admin only)
  const getUserById = async (id) => {
    return authFetch(`/users/${id}`);
  };

  // ========== ADMIN - COMPRAS (PROTEGIDAS) ==========

  // Obtener todas las compras (admin only)
  const getPurchases = async () => {
    return authFetch('/purchases');
  };

  // Obtener compras recientes (admin only)
  const getRecentPurchases = async (limit = 3) => {
    return authFetch(`/purchases/recent?limit=${limit}`);
  };

  return {
    //  (sin autenticación)
    getProducts,
    getProductById,
    getProductsByCategory,
    getCategories,

    // Admin Products (con autenticación)
    createProduct,
    updateProduct,
    deleteProduct,


    // Usuarios
    getCurrentUser,
    updateCurrentUser,
    syncUser,
    getUsers,
    getUserById,

    // Helpers
    authFetch,
    publicFetch,
  };
};