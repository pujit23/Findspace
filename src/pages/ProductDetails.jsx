import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Calendar, ShoppingCart, MessageCircle, Phone, Mail, CheckCircle, Tag } from 'lucide-react';
import { useProducts } from '../context/useProducts';
import { useCart } from '../context/useCart';
import '../styles/ProductDetails.css';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { addToCart, isInCart } = useCart();

    const product = products.find(p => p.id === parseInt(id) || p.id === id);

    if (!product) {
        return (
            <div className="loading-container">
                <div className="not-found-card">
                    <h3>Product not found</h3>
                    <p>This listing may have been removed or doesn't exist.</p>
                    <button onClick={() => navigate('/feed')} className="btn-primary">
                        Browse Listings
                    </button>
                </div>
            </div>
        );
    }

    const { title, price, image, branch, location, postedAt, condition, description, status, phone, email, campusZone, sellerEmail } = product;
    const fmtPrice = new Intl.NumberFormat('en-IN').format(price);
    const isSold = status === 'sold';

    // Check verified status
    const checkEmail = sellerEmail || email;
    const isVerifiedStudent = (() => {
        if (!checkEmail) return false;
        const domain = checkEmail.split('@')[1]?.toLowerCase() || '';
        return domain.endsWith('.edu') || domain.endsWith('.ac.in') || domain.endsWith('.edu.in');
    })();

    // Condition config
    const conditionConfig = {
        'new': { label: 'New', className: 'condition-new' },
        'like_new': { label: 'Like New', className: 'condition-like_new' },
        'good': { label: 'Good', className: 'condition-good' },
        'fair': { label: 'Fair', className: 'condition-fair' },
        'used': { label: 'Used', className: 'condition-fair' },
    };
    const condInfo = conditionConfig[condition] || conditionConfig['good'];

    const handleWhatsApp = () => {
        if (phone) {
            const message = `Hi, I saw your listing on FindSpace: "${title}". Is it still available?`;
            window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const handleEmail = () => {
        if (email) {
            const subject = `Inquiry about: ${title}`;
            const body = `Hi, I saw your listing for "${title}" on FindSpace and I'm interested. Is it still available?`;
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
    };

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        const days = Math.floor(diff / 86400);
        if (days === 1) return '1 day ago';
        if (days < 30) return `${days} days ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    return (
        <div className="product-details-container animate-fade-in">
            <button onClick={() => navigate(-1)} className="back-button">
                <ArrowLeft size={20} />
                Back to Feed
            </button>

            <div className="product-details-grid">
                <div className="details-image-container">
                    {image ? (
                        <img src={image} alt={title} className="details-image" />
                    ) : (
                        <div className="no-image-placeholder">
                            <span>No Image Available</span>
                        </div>
                    )}
                    {isSold && <div className="details-sold-badge">SOLD</div>}
                </div>

                <div className="details-content">
                    <div className="details-top-badges">
                        <span className={`detail-condition-badge ${condInfo.className}`}>
                            {condInfo.label}
                        </span>
                        {isVerifiedStudent && (
                            <span className="verified-badge">
                                <CheckCircle size={12} />
                                Verified Student
                            </span>
                        )}
                    </div>

                    <h1 className="details-title">{title}</h1>
                    
                    <div className="details-meta">
                        <div className="details-meta-item">
                            <User size={16} />
                            <span>{branch}</span>
                        </div>
                        <div className="details-meta-item">
                            <MapPin size={16} />
                            <span>{location}</span>
                        </div>
                        <div className="details-meta-item">
                            <Calendar size={16} />
                            <span>{timeAgo(postedAt)}</span>
                        </div>
                        {campusZone && (
                            <div className="details-meta-item campus-zone-meta">
                                <Tag size={14} />
                                <span>{campusZone}</span>
                            </div>
                        )}
                    </div>

                    <div className="details-price">₹{fmtPrice}</div>

                    <div className="details-description">
                        <h3>Description</h3>
                        <p>{description}</p>
                    </div>

                    <div className="details-actions">
                        {!isSold && (
                            <button 
                                onClick={() => addToCart(product)}
                                disabled={isInCart(product.id)}
                                className={`add-cart-btn ${isInCart(product.id) ? 'added' : ''}`}
                            >
                                <ShoppingCart size={20} />
                                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                        )}
                        <div className="contact-actions">
                            {phone && (
                                <button onClick={handleWhatsApp} className="contact-btn whatsapp">
                                    <MessageCircle size={20} />
                                    WhatsApp
                                </button>
                            )}
                            {email && (
                                <button onClick={handleEmail} className="contact-btn email-btn">
                                    <Mail size={20} />
                                    Email
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
