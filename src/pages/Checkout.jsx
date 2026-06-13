import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useProducts } from '../context/useProducts';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import '../styles/Checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { markProductSold } = useProducts();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const totalAmount = getCartTotal();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mark items as sold
        cartItems.forEach(item => {
            markProductSold(item.id);
        });

        clearCart();
        setIsProcessing(false);
        navigate('/payment', { state: { total: totalAmount } });
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container empty-cart-message">
                <h2>Your cart is empty</h2>
                <button 
                    onClick={() => navigate('/feed')}
                    className="place-order-btn go-shopping-btn"
                >
                    Go Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container animate-fade-in">
            <button 
                onClick={() => navigate(-1)} 
                className="back-btn"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-grid">
                <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
                    <h3 className="summary-title">Shipping Information</h3>
                    
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input 
                            type="tel" 
                            name="phone"
                            required
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Delivery Address</label>
                        <textarea 
                            name="address"
                            required
                            className="form-input"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </form>

                <div className="order-summary">
                    <h3 className="summary-title">Order Summary</h3>
                    
                    {cartItems.map(item => (
                        <div key={item.id} className="summary-item">
                            <span>{item.title} (x{item.quantity})</span>
                            <span>₹{new Intl.NumberFormat('en-IN').format(item.price * item.quantity)}</span>
                        </div>
                    ))}
                    
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{new Intl.NumberFormat('en-IN').format(getCartTotal())}</span>
                    </div>

                    <button 
                        type="submit"
                        form="checkout-form"
                        disabled={isProcessing}
                        className="place-order-btn"
                    >
                        {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
