import React, { useState, useEffect } from 'react';
import { CATEGORIES } from './initialData';
import config from '../utils/config';
import { ProductContext } from './productContext';

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load products from API with fallback to localStorage
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Try to load from API first (in production)
                // For now, we'll use localStorage as fallback since we don't have a backend
                const saved = localStorage.getItem(config.app.localStorageKey);
                if (saved) {
                    setProducts(JSON.parse(saved));
                }
                
                // In a real production app, you would call:
                // const apiProducts = await productAPI.getProducts();
                // setProducts(apiProducts);
                
            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products');
                
                // Fallback to empty array
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadProducts();
    }, []);

    const [categories] = useState(CATEGORIES);

    // Update localStorage whenever products change
    useEffect(() => {
        try {
            localStorage.setItem(config.app.localStorageKey, JSON.stringify(products));
        } catch (err) {
            console.error('Error saving products to localStorage:', err);
            // Don't set error here as it might be a minor issue
        }
    }, [products]);

    const addProduct = async (productData) => {
        try {
            const newProduct = {
                ...productData,
                id: Date.now(), // Using timestamp as ID for now
                postedAt: new Date().toISOString(),
                branch: productData.branch || 'You (Verified)',
                image: productData.image || null,
                condition: productData.condition || 'used',
                status: 'active', // Add status field for production
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // In a real production app, you would call:
            // const createdProduct = await productAPI.createProduct(productData);
            // setProducts(prev => [createdProduct, ...prev]);
            
            // For now, using local storage
            setProducts(prev => [newProduct, ...prev]);
            
            return newProduct;
        } catch (err) {
            console.error('Error adding product:', err);
            setError('Failed to add product');
            throw err;
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            // In a real production app, you would call:
            // await productAPI.updateProduct(id, updates);
            
            setProducts(prev => 
                prev.map(product => 
                    product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
                )
            );
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product');
            throw err;
        }
    };

    const deleteProduct = async (id) => {
        try {
            // In a real production app, you would call:
            // await productAPI.deleteProduct(id);
            
            setProducts(prev => prev.filter(product => product.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product');
            throw err;
        }
    };

    const markProductSold = async (id) => {
        try {
            // In a real production app, you would call:
            // await productAPI.markProductSold(id);
            
            updateProduct(id, { status: 'sold', soldAt: new Date().toISOString() });
        } catch (err) {
            console.error('Error marking product as sold:', err);
            setError('Failed to update product status');
            throw err;
        }
    };

    // Clear error function
    const clearError = () => setError(null);

    return (
        <ProductContext.Provider value={{ 
            products, 
            addProduct, 
            updateProduct,
            deleteProduct,
            markProductSold,
            categories,
            loading,
            error,
            clearError
        }}>
            {children}
        </ProductContext.Provider>
    );
}
