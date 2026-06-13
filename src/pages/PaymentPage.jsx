import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, Building, Wallet, Smartphone, ChevronRight, CheckCircle2 } from 'lucide-react';
import '../styles/PaymentPage.css';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const total = location.state?.total || 0;
    
    // State machine: 'input' | 'processing' | 'otp' | 'success'
    const [step, setStep] = useState('input');
    const [activeTab, setActiveTab] = useState('card');
    
    // Card states
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    
    // OTP states
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);
    
    // Processing / Metadata
    const [loadingText, setLoadingText] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        if (!location.state?.total) {
            navigate('/checkout', { replace: true });
        }
    }, [location, navigate]);

    // --- Input Handlers ---
    const handleCardNumber = (e) => {
        let val = e.target.value.replace(/\D/g, ''); 
        if (val.length > 16) val = val.substring(0, 16);
        let formatted = val.match(/.{1,4}/g)?.join('  ') || '';
        setCardDetails(prev => ({...prev, number: formatted}));
    };

    const handleExpiry = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.substring(0, 4);
        if (val.length >= 2) {
            val = val.substring(0, 2) + (val.length > 2 ? ' / ' + val.substring(2) : '');
        }
        setCardDetails(prev => ({...prev, expiry: val}));
    };

    const handleCvv = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 3) val = val.substring(0, 3);
        setCardDetails(prev => ({...prev, cvv: val}));
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1].focus();
        }
        
        // Auto submit when 6 chars full
        if (index === 5 && value !== '') {
            setTimeout(() => {
                submitOTP();
            }, 300);
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const getCardBrand = (number) => {
        if (number.startsWith('4')) return { name: 'VISA', class: 'visa' };
        if (number.startsWith('5')) return { name: 'MC', class: 'mastercard' };
        return null;
    };

    // --- Actions ---
    const initiatePayment = () => {
        setStep('processing');
        setLoadingText('Securing connection...');
        
        setTimeout(() => {
            setLoadingText('Authenticating with Bank...');
            setTimeout(() => {
                setStep('otp');
            }, 1800);
        }, 1200);
    };

    const submitOTP = () => {
        setStep('processing');
        setLoadingText('Verifying Payment OTP...');
        
        setTimeout(() => {
            setLoadingText('Processing Payment...');
            setTimeout(() => {
                setStep('success');
                setOrderId(`FS-${Math.floor(10000000 + Math.random() * 90000000)}`);
                
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 4000);
            }, 1500);
        }, 2000);
    };

    const brand = getCardBrand(cardDetails.number);

    // --- RENDERERS ---

    if (step === 'success') {
        return (
            <div className="payment-page-container">
                <div className="payment-card">
                    <div className="success-state animate-slide-up">
                        <div className="checkmark-circle">
                            <div className="checkmark-stem"></div>
                            <div className="checkmark-kick"></div>
                        </div>
                        <h2>Payment Successful</h2>
                        <p>Your order has been placed on FindSpace</p>
                        
                        <div className="receipt-card">
                            <div className="receipt-item">
                                <span className="receipt-label">Amount Paid</span>
                                <span className="receipt-value" style={{color: '#22c55e'}}>₹{new Intl.NumberFormat('en-IN').format(total)}</span>
                            </div>
                            <div className="receipt-item">
                                <span className="receipt-label">Transaction ID</span>
                                <span className="receipt-value">{orderId}</span>
                            </div>
                        </div>
                        
                        <div className="redirect-text">
                            <div className="redirect-spinner"></div>
                            Returning to merchant...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'processing') {
        return (
            <div className="payment-page-container">
                <div className="payment-card">
                    <div className="processing-state animate-fade-in">
                        <div className="processing-spinner-wrapper">
                            <div className="processing-pulse"></div>
                            <div className="processing-ring"></div>
                            <div className="processing-icon">
                                <ShieldCheck size={32} />
                            </div>
                        </div>
                        <h2>Processing</h2>
                        <p>{loadingText}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'otp') {
        return (
            <div className="payment-page-container">
                <div className="payment-card">
                    <div className="otp-state animate-slide-up">
                        <div className="bank-header">
                            <div className="bank-logo">
                                <Building size={20} />
                            </div>
                            <div className="bank-info">
                                <h3>Bank Authentication</h3>
                                <p>Mandatory 3D Secure Verification</p>
                            </div>
                        </div>
                        
                        <div className="amount-display" style={{marginBottom: '20px', padding: '16px'}}>
                            <span className="amount-label">Merchant Name</span>
                            <span className="amount-value" style={{fontSize: '1.2rem', color: '#fff'}}>FindSpace PG</span>
                        </div>

                        <p className="otp-instructions">
                            We have sent a one-time password (OTP) to the mobile number registered with your card ending in <span className="otp-number">{cardDetails.number ? cardDetails.number.slice(-4) : 'XXXX'}</span>.
                        </p>

                        <div className="otp-input-boxes">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={el => otpRefs.current[index] = el}
                                    value={data}
                                    onChange={e => handleOtpChange(index, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(index, e)}
                                    className="otp-box"
                                />
                            ))}
                        </div>

                        <div className="resend-text">
                            Didn't receive the OTP? <span className="resend-link">Resend Code</span>
                        </div>

                        <button className="pay-btn" onClick={submitOTP} style={{marginTop: 'auto'}}>
                            Submit Securely <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page-container animate-fade-in">
            <div className="payment-card">
                <div className="payment-header">
                    <div className="brand-section">
                        <div className="brand-logo">
                            <Lock size={16} strokeWidth={2.5} />
                        </div>
                        <div className="brand-text">
                            <h1>Secure Checkout</h1>
                            <p>Powered by FindSpace PG</p>
                        </div>
                    </div>
                    <div className="amount-badge">
                        <span className="amount-label">Payable Amount</span>
                        <span className="amount-value">₹{new Intl.NumberFormat('en-IN').format(total)}</span>
                    </div>
                </div>

                <div className="payment-tabs">
                    <button 
                        className={`payment-tab ${activeTab === 'card' ? 'active' : ''}`}
                        onClick={() => setActiveTab('card')}
                    >
                        <CreditCard size={16} /> Card
                    </button>
                    <button 
                        className={`payment-tab ${activeTab === 'upi' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upi')}
                    >
                        <Smartphone size={16} /> UPI
                    </button>
                    <button 
                        className={`payment-tab ${activeTab === 'wallet' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wallet')}
                    >
                        <Wallet size={16} /> Wallet
                    </button>
                </div>

                <div className="payment-form-section">
                    {activeTab === 'card' && (
                        <div className="animate-fade-in">
                            <div className="payment-input-group">
                                <label className="input-label">Card Number</label>
                                <div className="payment-input-wrapper">
                                    <input 
                                        className="payment-input" 
                                        placeholder="0000  0000  0000  0000" 
                                        value={cardDetails.number}
                                        onChange={handleCardNumber}
                                    />
                                    {brand && (
                                        <div className="card-icon-overlay animate-fade-in">
                                            <div className={`card-brand-icon ${brand.class}`}>
                                                {brand.name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="payment-row">
                                <div className="payment-input-group">
                                    <label className="input-label">Valid Thru</label>
                                    <input 
                                        className="payment-input" 
                                        placeholder="MM / YY" 
                                        value={cardDetails.expiry}
                                        onChange={handleExpiry}
                                    />
                                </div>
                                <div className="payment-input-group">
                                    <label className="input-label">CVV</label>
                                    <input 
                                        className="payment-input" 
                                        placeholder="•••" 
                                        type="password"
                                        value={cardDetails.cvv}
                                        onChange={handleCvv}
                                    />
                                </div>
                            </div>
                            
                            <div className="payment-input-group" style={{marginBottom: 0}}>
                                <label className="input-label">Name on Card</label>
                                <input 
                                    className="payment-input" 
                                    placeholder="Enter cardholder name" 
                                    value={cardDetails.name}
                                    onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'upi' && (
                        <div className="animate-fade-in" style={{paddingTop: '8px'}}>
                            <label className="input-label">Enter UPI ID (VPA)</label>
                            <input 
                                className="payment-input" 
                                placeholder="name@upi" 
                                type="text" 
                            />
                            <p style={{fontSize: '0.8rem', color: '#565E7A', marginTop: '12px'}}>
                                A payment request will be sent to your UPI app.
                            </p>
                        </div>
                    )}

                    {activeTab === 'wallet' && (
                        <div className="animate-fade-in" style={{paddingTop: '8px'}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                {['Paytm Wallet', 'Amazon Pay', 'MobiKwik'].map(wallet => (
                                    <label key={wallet} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#1A1D27', borderRadius: '10px', border: '1px solid #2E3245', cursor: 'pointer'
                                    }}>
                                        <input type="radio" name="wallet" />
                                        <span style={{color: '#fff', fontSize: '0.95rem'}}>{wallet}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button className="pay-btn" onClick={initiatePayment}>
                    <Lock size={16} /> Pay ₹{new Intl.NumberFormat('en-IN').format(total)}
                </button>

                <div className="security-footer">
                    <div className="security-item">
                        <ShieldCheck size={14} color="#22c55e" />
                        <span>256-bit Encrypted</span>
                    </div>
                    <div className="security-item">
                        <CheckCircle2 size={14} color="#3b82f6" />
                        <span>PCI DSS Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
