import React, { useState, useEffect } from 'react';
import config from '../utils/config';
import { CartContext } from './cartContext';

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem(config.app.localStorageKey + '_cart');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            } catch (err) {
                console.error('Error loading cart:', err);
                setError('Failed to load cart');
            }
        };
        
        loadCart();
    }, []);

    // Update localStorage whenever cart changes
    useEffect(() => {
        try {
            localStorage.setItem(config.app.localStorageKey + '_cart', JSON.stringify(cartItems));
        } catch (err) {
            console.error('Error saving cart to localStorage:', err);
        }
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartItemCount,
            isInCart,
            error
        }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;

