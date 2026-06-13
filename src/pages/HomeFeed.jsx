import React, { useState } from 'react';
import { Search, AlertCircle, Filter } from 'lucide-react';
import { useProducts } from '../context/useProducts';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { CATEGORY_ICONS } from '../context/initialData';
import '../styles/HomeFeed.css';

export default function HomeFeed() {
    const { products, categories, loading, error, clearError } = useProducts();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const isActive = p.status !== 'sold';
        return matchesCategory && matchesSearch && isActive;
    });

    if (loading) {
        return (
            <div className="home-feed animate-fade-in">
                <header className="feed-header-section">
                    <div className="feed-header-content">
                        <h1 className="feed-title">
                            Discover & Trade <br />
                            <span className="text-gradient">Campus Treasures</span>
                        </h1>
                        <div className="search-wrapper">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                className="search-input-transparent"
                                placeholder="What are you looking for today?"
                                disabled
                            />
                        </div>
                    </div>
                </header>
                <div className="feed-content container">
                    <div className="products-grid">
                        {[...Array(8)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <AlertCircle size={48} className="error-icon" />
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={clearError} className="btn-primary retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-feed animate-fade-in">
            {/* Premium Header Section */}
            <header className="feed-header-section">
                <div className="feed-header-content">
                    <h1 className="feed-title">
                        Discover & Trade <br />
                        <span className="text-gradient">Campus Treasures</span>
                    </h1>

                    <div className="search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            className="search-input-transparent"
                            placeholder="What are you looking for today?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>
                                ×
                            </button>
                        )}
                    </div>

                    <div className="categories-wrapper">
                        <div className="categories-scroll">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                                >
                                    <span className="cat-icon">{CATEGORY_ICONS[cat] || '🏷️'}</span> 
                                    {cat === 'All' ? 'All Items' : cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Results Section */}
            <div className="feed-content container">
                <div className="results-header">
                    <h2 className="section-title">
                        {activeCategory === 'All' ? 'Fresh Finds' : `${activeCategory}`}
                        <span className="count-badge">{filteredProducts.length}</span>
                    </h2>
                    <button className="filter-btn">
                        <Filter size={16} /> Sort & Filter
                    </button>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-illustration">
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <circle cx="60" cy="60" r="50" fill="var(--primary-soft)" stroke="var(--primary-light)" strokeWidth="2" />
                                <circle cx="52" cy="52" r="20" stroke="var(--primary)" strokeWidth="3" fill="none" />
                                <line x1="66" y1="66" x2="82" y2="82" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
                                <line x1="44" y1="52" x2="60" y2="52" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                                <line x1="52" y1="44" x2="52" y2="60" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                            </svg>
                        </div>
                        <h3>No items found</h3>
                        <p>
                            We couldn't find any matches for "{searchQuery}" in {activeCategory}.
                            <br />Try adjusting your search or category.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setActiveCategory('All');
                            }}
                            className="btn-primary view-all-btn"
                        >
                            View All Items
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                {...product}
                                style={{ animationDelay: `${index * 60}ms` }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
