// Configuration utility for FindSpace
// Handles different environments and settings

const config = {
    // Environment settings
    isDevelopment: import.meta.env.NODE_ENV === 'development',
    isProduction: import.meta.env.NODE_ENV === 'production',
    
    // API settings
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
        timeout: 10000, // 10 seconds
        retries: 3,
    },
    
    // App settings
    app: {
        name: 'FindSpace',
        version: '1.0.0',
        localStorageKey: 'findspace_products',
    },
    
    // Validation settings
    validation: {
        maxTitleLength: 60,
        maxDescriptionLength: 200,
        maxPrice: 999999,
        minPrice: 0,
        minTitleLength: 3,
        minDescriptionLength: 10,
    },
    
    // Feature flags
    features: {
        enableApi: import.meta.env.VITE_ENABLE_API === 'true' || false,
        enableImageUpload: import.meta.env.VITE_ENABLE_IMAGE_UPLOAD === 'true' || false,
        enableUserAuthentication: import.meta.env.VITE_ENABLE_AUTH === 'true' || false,
    }
};

export default config;