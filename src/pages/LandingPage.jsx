import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ShoppingCart, Star, ArrowRight, Sparkles, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import '../styles/LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleExplore = () => {
        navigate('/feed');
    };

    const features = [
        {
            icon: <Shield size={32} />,
            title: 'Secure Campus Trading',
            description: 'Verified student identities ensure every transaction is safe and trusted.'
        },
        {
            icon: <Users size={32} />,
            title: 'Exclusive Community',
            description: 'Connect directly with peers from your university. No outsiders.'
        },
        {
            icon: <ShoppingCart size={32} />,
            title: 'Easy Buying & Selling',
            description: 'List items in seconds and find amazing deals right on campus.'
        },
        {
            icon: <Star size={32} />,
            title: 'Curated Quality',
            description: 'High-quality pre-loved items, books, and gear found nearby.'
        }
    ];

    return (
        <div className="landing-page">
            <div className="landing-background-pattern" />

            <nav className="landing-nav glass">
                <div className="nav-logo">
                    <div className="nav-logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                            <path d="M11 8v6" />
                            <path d="M8 11h6" />
                        </svg>
                    </div>
                    <span className="logo-text">FindSpace</span>
                </div>
                <div className="nav-right">
                    <button 
                        onClick={toggleTheme} 
                        className="theme-btn-landing"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button onClick={handleLogin} className="btn-secondary nav-login-btn">
                        Sign In
                    </button>
                </div>
            </nav>

            <main className="landing-content">
                {/* Hero Section */}
                <section className="landing-hero animate-fade-in">
                    <div className="hero-text">
                        <div className="hero-badge animate-scale-in">
                            <Sparkles size={16} />
                            <span>Exclusive for Students</span>
                        </div>
                        <h1 className="landing-title">
                            Find. List. Connect. <br />
                            <span className="text-gradient">All within your campus.</span>
                        </h1>
                        <p className="landing-subtitle">
                            The smartest way for students to trade within their university community. Buy, sell, and exchange with confidence.
                        </p>

                        <div className="hero-search-bar">
                            <Search size={20} className="hero-search-icon" />
                            <input 
                                type="text" 
                                placeholder="What are you looking for?" 
                                className="hero-search-input"
                                onFocus={handleExplore}
                                readOnly
                            />
                            <button onClick={handleExplore} className="hero-search-btn">
                                Search
                            </button>
                        </div>

                        <div className="hero-actions">
                            <button onClick={handleLogin} className="btn-primary hero-btn">
                                Start Exploring <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual animate-slide-up">
                        <div className="visual-card glass">
                            <div className="visual-header">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                            </div>
                            <div className="visual-content">
                                <div className="mock-item">
                                    <div className="mock-img"></div>
                                    <div className="mock-lines">
                                        <span className="line long"></span>
                                        <span className="line short"></span>
                                    </div>
                                    <div className="mock-btn"></div>
                                </div>
                                <div className="floating-badge badge-1 glass">
                                    <span>📚 Textbooks</span>
                                </div>
                                <div className="floating-badge badge-2 glass">
                                    <span>🚲 Cycles</span>
                                </div>
                                <div className="floating-badge badge-3 glass">
                                    <span>💻 Gadgets</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="landing-features">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <div className="nav-logo-icon small">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                                <path d="M11 8v6" />
                                <path d="M8 11h6" />
                            </svg>
                        </div>
                        <span>FindSpace</span>
                    </div>
                    <p>Made with ❤️ for students, by students</p>
                    <p className="landing-footer-copy">© {new Date().getFullYear()} FindSpace. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
