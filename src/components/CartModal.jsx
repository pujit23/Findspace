import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../context/useCart';
import '../styles/CartModal.css';

export default function CartModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, getCartTotal } = useCart();

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="modal-overlay">
            <div className="cart-modal">
                <div className="modal-header">
                    <div className="header-title-group">
                        <ShoppingCart size={24} color="var(--primary)" />
                        <h2 className="modal-title">Your Cart</h2>
                    </div>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <ShoppingCart size={64} className="empty-cart-icon" />
                        <h3>Your cart is empty</h3>
                        <p className="empty-cart-text">
                            Time to find some hidden treasures!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items-container">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="cart-item-image" />
                                    ) : (
                                        <div className="cart-item-image">
                                            <ShoppingCart size={24} color="#9CA3AF" />
                                        </div>
                                    )}

                                    <div className="cart-item-info">
                                        <h4 className="cart-item-title">{item.title}</h4>
                                        <p className="cart-item-price">₹{new Intl.NumberFormat('en-IN').format(item.price)}</p>
                                    </div>

                                    <div className="cart-item-actions">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="qty-btn"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="cart-item-quantity">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="qty-btn"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Total</span>
                                <span>₹{new Intl.NumberFormat('en-IN').format(getCartTotal())}</span>
                            </div>

                            <button onClick={handleCheckout} className="checkout-btn">
                                Proceed to Checkout <ArrowRight size={20} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
