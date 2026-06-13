import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
            navigate('/feed');
        } catch (error) {
            const msg = (error && error.message) ? error.message : 'Login failed. Please try again.';
            setErrorMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <button 
                onClick={toggleTheme} 
                className="login-theme-toggle"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="login-card animate-fade-in">
                <div className="login-header">
                    <div className="login-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                            <path d="M11 8v6" />
                            <path d="M8 11h6" />
                        </svg>
                    </div>
                    <h1>Welcome to FindSpace</h1>
                    <p>The exclusive marketplace for your campus community</p>
                </div>

                <div className="login-content">
                    {errorMsg && (
                        <div className="login-error-banner">
                            {errorMsg}
                        </div>
                    )}
                    <button 
                        className={`google-login-btn ${isLoading ? 'loading' : ''}`}
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google Logo" 
                            className="google-icon"
                        />
                        <span>
                            {isLoading ? 'Signing in...' : 'Sign in with Google'}
                        </span>
                    </button>
                    
                    <p className="login-note">
                        Please sign in with your university email address to access the marketplace and get verified status.
                    </p>
                </div>
                
                <div className="login-footer">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
            </div>
        </div>
    );
}
