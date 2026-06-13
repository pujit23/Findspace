import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, Plus, MessageCircle, User, MapPin, ShoppingCart, LogIn, LogOut, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import '../styles/Layout.css';

export default function Layout({ onSellClick, onCartClick }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { getCartItemCount } = useCart();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isLanding = location.pathname === '/';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (isLanding) return <Outlet />;

    const handleSellClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            onSellClick();
        }
        setMobileMenuOpen(false);
    };

    return (
        <div className="layout-wrapper">
            {/* Premium Frosted Glass Header */}
            <header className="header-glass">
                <div className="container header-container">
                    <NavLink to="/feed" className="logo-section" aria-label="FindSpace Home">
                        <div className="logo-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                                <path d="M11 8v6" />
                                <path d="M8 11h6" />
                            </svg>
                        </div>
                        <div className="brand-info">
                            <h1 className="brand-title">FindSpace</h1>
                            <p className="brand-subtitle">Campus Marketplace</p>
                        </div>
                    </NavLink>

                    <div className="header-actions">
                        {/* Desktop Nav Items */}
                        <div className="desktop-nav">
                            <NavLink to="/feed" className="nav-link">Home</NavLink>
                        </div>

                        <div className="campus-badge">
                            <MapPin size={14} />
                            <span className="campus-text">{user?.campus || 'Campus'}</span>
                        </div>

                        <div className="desktop-nav">
                            <button 
                                onClick={toggleTheme} 
                                className="icon-btn-desktop theme-toggle" 
                                title={theme === 'dark' ? "Light Mode" : "Dark Mode"}
                                aria-label="Toggle theme"
                            >
                                <div className="theme-icon-wrapper">
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </div>
                            </button>

                            <button onClick={onCartClick} className="icon-btn-desktop" aria-label="Open cart">
                                <div className="cart-badge-wrapper">
                                    <ShoppingCart size={22} />
                                    {getCartItemCount() > 0 && (
                                        <span className="cart-count-badge-desktop">
                                            {getCartItemCount()}
                                        </span>
                                    )}
                                </div>
                            </button>

                            <button onClick={handleSellClick} className="btn-primary sell-btn-desktop">
                                + Sell
                            </button>

                            {user ? (
                                <div className="user-profile-menu">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="user-avatar" />
                                    ) : (
                                        <div className="user-avatar-placeholder">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    {user.isVerifiedStudent && (
                                        <span className="verified-dot" title="Verified Student">✓</span>
                                    )}
                                    <button onClick={logout} className="logout-btn" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className="btn-secondary login-btn-desktop">
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button 
                            className="mobile-menu-btn" 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-dropdown animate-slide-up">
                        <NavLink to="/feed" className="mobile-dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                            <Home size={20} /> Home
                        </NavLink>
                        <button onClick={toggleTheme} className="mobile-dropdown-item">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <button onClick={() => { onCartClick(); setMobileMenuOpen(false); }} className="mobile-dropdown-item">
                            <ShoppingCart size={20} /> Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
                        </button>
                        <button onClick={handleSellClick} className="mobile-dropdown-item sell-item">
                            <Plus size={20} /> Sell an Item
                        </button>
                        {user ? (
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mobile-dropdown-item">
                                <LogOut size={20} /> Logout
                            </button>
                        ) : (
                            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="mobile-dropdown-item">
                                <LogIn size={20} /> Login
                            </button>
                        )}
                    </div>
                )}
            </header>

            <main className="container main-content">
                <Outlet />
            </main>

            {/* Premium Footer */}
            <footer className="app-footer">
                <div className="container footer-container">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon footer-logo-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                    <path d="M11 8v6" />
                                    <path d="M8 11h6" />
                                </svg>
                            </div>
                            <span className="footer-brand-name">FindSpace</span>
                        </div>
                        <p className="footer-tagline">The smartest way for students to trade within their university.</p>
                    </div>
                    <div className="footer-links">
                        <NavLink to="/feed">Browse</NavLink>
                        <NavLink to="/login">Login</NavLink>
                    </div>
                    <div className="footer-bottom">
                        <p>Made with ❤️ for students, by students</p>
                        <p className="footer-copy">© {new Date().getFullYear()} FindSpace. All rights reserved.</p>
                    </div>
                </div>
                <div className="footer-bottom-credit">
                    <span>Made with ❤️ for students, by students</span>
                    <span className="divider">·</span>
                    <span>Crafted by <strong className="credit-name">Pujit Balanthiran</strong></span>
                </div>
            </footer>

            {/* Modern Floating Mobile Navigation */}
            <nav className="mobile-nav" aria-label="Mobile navigation">
                <NavLink to="/feed" className="mobile-nav-item">
                    {({ isActive }) => (
                        <>
                            <Home size={24} strokeWidth={isActive ? 2.5 : 2} className="mobile-nav-icon" />
                            <span>Home</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/categories" className="mobile-nav-item">
                    {({ isActive }) => (
                        <>
                            <Grid size={24} strokeWidth={isActive ? 2.5 : 2} className="mobile-nav-icon" />
                            <span>Browse</span>
                        </>
                    )}
                </NavLink>

                <button onClick={handleSellClick} className="sell-fab" aria-label="Sell an item">
                    <Plus size={32} />
                </button>

                <div className="mobile-nav-item" onClick={onCartClick}>
                    <div className="cart-badge-container">
                        <ShoppingCart size={24} strokeWidth={2} className="mobile-nav-icon" />
                        {getCartItemCount() > 0 && (
                            <span className="cart-count-badge">
                                {getCartItemCount()}
                            </span>
                        )}
                    </div>
                    <span>Cart</span>
                </div>

                <NavLink to="/profile" className="mobile-nav-item">
                    {({ isActive }) => (
                        <>
                            <User size={24} strokeWidth={isActive ? 2.5 : 2} className="mobile-nav-icon" />
                            <span>Profile</span>
                        </>
                    )}
                </NavLink>
            </nav>
        </div>
    );
}
