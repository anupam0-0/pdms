export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export const CHECK_HEALTH = "/health";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    GETME: "/auth/me",
    PROFILE: "/auth/profile",
  },

  PRODUCTS: {
    GET_ITEMS: "/products/", // public
    SEARCH_STORE: "/products/search", // public
    GET_ITEMS_BY_ID: (productId: string) => `/products/${productId}`, // public
    CREATE_ITEM: "/products/",
    UPDATE_ITEM: (productId: string) => `/products/${productId}`,
    DELETE_ITEM: (productId: string) => `/products/${productId}`,
  },

  INVENTORY: {
    GET_ORDERS: "/orders/",
    GET_ORDER_BY_ID: (orderId: string) => `/orders/${orderId}`, //:id
    CREATE_ORDER: "/orders/",
    UPDATE_STATUS: (orderId: string) => `/orders/${orderId}/status`, //:id
    CANCEL_STATUS: (orderId: string) => `/orders/${orderId}/cancel`, //:id
  },

  FEATURED_ITEMS: {
    GET_FEATURED_ITEMS: "/featured/", // public
    GET_FEATURED_ACTIVE_ITEMS: "/featured/active/", // public
    GET_FEATURED_ITEM_BY_ID: (id: string) => `/featured/${id}`, // public
    CREATE_FEATURED_ITEM: "/featured/", // restricted
    UPDATE_FEATURED_ITEM: (id: string) => `/featured/${id}`, //:id
    DELETE_FEATURED_ITEM: (id: string) => `/featured/${id}`, //:id
    DELETE_FEATURED_EXPIRED_ITEMS: "/featured/cleanup/expired", // restricted
  },
};
