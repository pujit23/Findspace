import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingCart, Heart, Clock, CheckCircle } from 'lucide-react';
import { useCart } from '../context/useCart';
import '../styles/ProductCard.css';

// Skeleton Loader Component
export function ProductCardSkeleton() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image skeleton"></div>
            <div style={{ padding: '16px' }}>
                <div className="skeleton skeleton-text long"></div>
                <div className="skeleton skeleton-text short"></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: '6px' }}></div>
                    <div className="skeleton" style={{ width: '40px', height: '12px', borderRadius: '6px' }}></div>
                </div>
            </div>
        </div>
    );
}

export default function ProductCard({ id, title, price, image, branch, location, postedAt, condition, description, status, campusZone, sellerEmail, style }) {
    const { addToCart, isInCart } = useCart();
    const navigate = useNavigate();

    // Format price
    const fmtPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);

    // Format relative time
    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        const days = Math.floor(diff / 86400);
        if (days === 1) return '1 day ago';
        if (days < 30) return `${days} days ago`;
        return `${Math.floor(days / 30)}mo ago`;
    };

    // Check if seller has an institutional email
    const isVerifiedStudent = (() => {
        if (!sellerEmail) return false;
        const domain = sellerEmail.split('@')[1]?.toLowerCase() || '';
        return domain.endsWith('.edu') || domain.endsWith('.ac.in') || domain.endsWith('.edu.in');
    })();

    // Condition display config
    const conditionConfig = {
        'new': { label: 'New', className: 'condition-new' },
        'like_new': { label: 'Like New', className: 'condition-like_new' },
        'good': { label: 'Good', className: 'condition-good' },
        'fair': { label: 'Fair', className: 'condition-fair' },
        'used': { label: 'Used', className: 'condition-fair' },
    };

    const condInfo = conditionConfig[condition] || conditionConfig['good'];

    const handleCardClick = (e) => {
        if (e.target.closest('button')) return;
        navigate(`/product/${id}`);
    };

    const isSold = status === 'sold';

    return (
        <div
            className={`product-card ${isSold ? 'sold' : ''}`}
            onClick={!isSold ? handleCardClick : undefined}
            style={style}
        >
            <div className="product-image-container">
                <div className="card-overlay">
                    {!isSold && (
                        <div className="overlay-actions">
                            <button className="action-btn" aria-label="Add to wishlist">
                                <Heart size={18} />
                            </button>
                            <button
                                onClick={() => addToCart({ id, title, price, image, branch, location, postedAt, condition, description, status })}
                                disabled={isInCart(id)}
                                className={`action-btn ${isInCart(id) ? 'active' : ''}`}
                                aria-label={isInCart(id) ? 'In cart' : 'Add to cart'}
                            >
                                <ShoppingCart size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {isSold && <div className="sold-badge-overlay">SOLD</div>}

                {image ? (
                    <img src={image} alt={title} className="product-image" loading="lazy" />
                ) : (
                    <div className="no-image-placeholder">
                        <div className="placeholder-icon">📷</div>
                    </div>
                )}

                <div className="product-badges-top">
                    <span className={`badge-condition ${condInfo.className}`}>
                        {condInfo.label}
                    </span>
                </div>
            </div>

            <div className="product-details">
                <div className="product-header">
                    <h3 className="product-title">{title}</h3>
                    <div className="product-price">{fmtPrice}</div>
                </div>

                {campusZone && (
                    <div className="campus-zone-tag">
                        <MapPin size={10} />
                        {campusZone}
                    </div>
                )}

                <div className="product-footer">
                    <div className="seller-info">
                        <div className="seller-avatar-small">
                            {branch?.charAt(0) || 'S'}
                        </div>
                        <span className="seller-branch">{branch}</span>
                        {isVerifiedStudent && (
                            <CheckCircle size={12} className="verified-icon" />
                        )}
                    </div>

                    <div className="post-meta">
                        <span className="meta-item">
                            <Clock size={12} /> {timeAgo(postedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
