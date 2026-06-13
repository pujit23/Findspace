// API Service Layer for FindSpace
// This provides a structured approach for API integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic API request function with error handling
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API request failed: ${url}`, error);
        throw error;
    }
};

// Product API functions
export const productAPI = {
    // Get all products
    getProducts: () => apiRequest('/products'),
    
    // Get products by category
    getProductsByCategory: (category) => apiRequest(`/products?category=${category}`),
    
    // Get products by search query
    searchProducts: (query) => apiRequest(`/products/search?q=${encodeURIComponent(query)}`),
    
    // Get a single product
    getProduct: (id) => apiRequest(`/products/${id}`),
    
    // Create a new product
    createProduct: (productData) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    }),
    
    // Update a product
    updateProduct: (id, productData) => apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    }),
    
    // Delete a product
    deleteProduct: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE',
    }),
    
    // Mark product as sold
    markProductSold: (id) => apiRequest(`/products/${id}/sold`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'sold' }),
    }),
};

// User API functions (placeholder for future implementation)
export const userAPI = {
    getCurrentUser: () => apiRequest('/user'),
    updateUser: (userData) => apiRequest('/user', {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
};

// Category API functions
export const categoryAPI = {
    getCategories: () => apiRequest('/categories'),
};