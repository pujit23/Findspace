import React, { useState, useEffect } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { useProducts } from '../context/useProducts';
import { useAuth } from '../context/useAuth';
import { CAMPUS_ZONES, CONDITIONS } from '../context/initialData';
import '../styles/SellModal.css';

const BANNED_KEYWORDS = [
  // Illegal substances
  "drugs", "weed", "marijuana", "ganja", "cocaine", "heroin", "mdma",
  "alcohol", "beer", "whiskey", "wine", "liquor", "vodka", "rum",
  "cigarette", "cigarettes", "tobacco", "vape", "vaping", "nicotine",
  "hookah", "bong", "rolling paper",
  // High voltage / dangerous electrical
  "high voltage", "generator", "inverter", "transformer", "welding machine",
  "electric fence", "soldering iron", "plasma cutter", "industrial drill",
  // Weapons & prohibited
  "gun", "pistol", "revolver", "rifle", "firearm", "ammunition", "bullet",
  "knife", "blade", "sword", "dagger", "machete", "weapon", "explosive",
  "bomb", "grenade", "taser", "stun gun", "pepper spray",
  // Heavy / prohibited campus items
  "refrigerator", "fridge", "washing machine", "air conditioner", "ac unit",
  "gas cylinder", "lpg cylinder", "heavy machinery", "industrial equipment",
  // Other prohibited
  "fireworks", "firecrackers", "stolen", "fake id", "counterfeit"
];

const checkBannedItems = (title, description, category) => {
  const fullText = `${title} ${description} ${category}`.toLowerCase();
  return BANNED_KEYWORDS.find(keyword => fullText.includes(keyword.toLowerCase()));
};

export default function SellModal({ onClose }) {
    const { addProduct, categories, error: contextError } = useProducts();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: 'Electronics',
        condition: 'good',
        location: 'Hostel Block A',
        campusZone: 'Hostel Block A',
        image: null,
        phone: '',
        email: ''
    });

    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [bannedError, setBannedError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setPreviewUrl(null);
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setSubmitError('Title is required');
            return false;
        }
        
        if (formData.title.length < 3) {
            setSubmitError('Title must be at least 3 characters');
            return false;
        }
        
        if (!formData.price || Number(formData.price) <= 0) {
            setSubmitError('Valid price is required');
            return false;
        }
        
        if (formData.price > 999999) {
            setSubmitError('Price seems too high');
            return false;
        }
        
        if (!formData.description.trim()) {
            setSubmitError('Description is required');
            return false;
        }
        
        if (formData.description.length < 10) {
            setSubmitError('Description must be at least 10 characters');
            return false;
        }

        if (!formData.phone.trim() && !formData.email.trim()) {
            setSubmitError('Either Phone Number or Email is required');
            return false;
        }
        
        setSubmitError(null);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setBannedError(null);

        const bannedWord = checkBannedItems(formData.title, formData.description, formData.category);
        if (bannedWord) {
            setBannedError(`"${bannedWord}" is not allowed on FindSpace.`);
            setIsSubmitting(false);
            return;
        }
        
        try {
            const imageUrl = previewUrl || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

            await addProduct({
                title: formData.title,
                price: Number(formData.price),
                location: formData.location,
                category: formData.category,
                condition: formData.condition,
                campusZone: formData.campusZone,
                image: imageUrl,
                description: formData.description,
                phone: formData.phone,
                email: formData.email,
                sellerEmail: formData.email
            });
            
            setFormData({
                title: '',
                price: '',
                description: '',
                category: 'Electronics',
                condition: 'good',
                location: 'Hostel Block A',
                campusZone: 'Hostel Block A',
                image: null,
                phone: '',
                email: ''
            });
            setPreviewUrl(null);
            
            onClose();
        } catch (err) {
            setSubmitError('Failed to add product. Please try again.');
            console.error('Error adding product:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter out 'All' from form categories
    const formCategories = categories.filter(c => c !== 'All');

    return (
        <div className="sell-modal-overlay animate-fade-in">
            <div className="sell-modal">
                <div className="sell-modal-header">
                    <h2 className="sell-modal-title">Sell an Item</h2>
                    <button onClick={onClose} className="sell-modal-close" aria-label="Close">
                        <X size={24} />
                    </button>
                </div>

                <div className="sell-modal-body">
                    {(submitError || contextError) && (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            <span>{submitError || contextError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="sell-form-grid">
                        <div className="sell-input-group">
                            <label className="sell-label">Product Title</label>
                            <input
                                type="text"
                                className="sell-input"
                                placeholder="What are you selling?"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="sell-form-row">
                            <div className="sell-input-group">
                                <label className="sell-label">Price (₹)</label>
                                <input
                                    type="number"
                                    className="sell-input"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div className="sell-input-group">
                                <label className="sell-label">Category</label>
                                <select
                                    className="sell-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {formCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sell-form-row">
                            <div className="sell-input-group">
                                <label className="sell-label">Condition</label>
                                <select
                                    className="sell-select"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                >
                                    {CONDITIONS.map(cond => (
                                        <option key={cond.value} value={cond.value}>{cond.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sell-input-group">
                                <label className="sell-label">Campus Zone</label>
                                <select
                                    className="sell-select"
                                    value={formData.campusZone}
                                    onChange={(e) => setFormData({ ...formData, campusZone: e.target.value, location: e.target.value })}
                                >
                                    {CAMPUS_ZONES.map(zone => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sell-form-row">
                            <div className="sell-input-group">
                                <label className="sell-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="sell-input"
                                    placeholder="Your phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="sell-input-group">
                                <label className="sell-label">Email Address</label>
                                <input
                                    type="email"
                                    className="sell-input"
                                    placeholder="Your email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="sell-input-group">
                            <label className="sell-label">Description</label>
                            <textarea
                                className="sell-textarea"
                                rows="4"
                                placeholder="Describe your item..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="sell-input-group">
                            <label className="sell-label">Photos</label>
                            {previewUrl ? (
                                <div className="image-preview-wrapper">
                                    <img src={previewUrl} alt="Preview" className="image-preview" />
                                    <button 
                                        type="button" 
                                        onClick={removeImage}
                                        className="remove-image-btn"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <label className="image-upload-area">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden-input"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Camera size={32} color="var(--primary)" className="upload-icon" />
                                    <p className="upload-hint">Click to upload photo</p>
                                </label>
                            )}
                        </div>

                    {bannedError && (
                        <div style={{
                            background: 'rgba(255, 59, 59, 0.1)',
                            border: '1px solid #FF3B3B',
                            borderRadius: '10px',
                            padding: '14px 16px',
                            marginBottom: '16px',
                            color: 'var(--text-main)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF3B3B', fontWeight: 'bold', marginBottom: '4px' }}>
                                <span>⚠️</span>
                                <span>Item Not Allowed</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                                {bannedError}
                            </p>
                            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '20px', margin: '8px 0', lineHeight: '1.5' }}>
                                <li>Illegal substances & narcotics</li>
                                <li>High voltage & dangerous electrical equipment</li>
                                <li>Weapons & prohibited items</li>
                                <li>Heavy appliances & industrial machinery</li>
                                <li>Fireworks & counterfeit items</li>
                            </ul>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px', cursor: 'pointer' }}>
                                View full campus marketplace guidelines
                            </div>
                        </div>
                    )}

                        <button 
                            type="submit" 
                            className="sell-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Item'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
