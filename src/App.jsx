import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import HomeFeed from './pages/HomeFeed';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import PaymentPage from './pages/PaymentPage';
import SellModal from './components/SellModal';
import CartModal from './components/CartModal';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <BrowserRouter>
              {isSellModalOpen && <SellModal onClose={() => setIsSellModalOpen(false)} />}
              {isCartModalOpen && <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />}
  
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/payment" element={<PaymentPage />} />
  
                <Route element={<Layout 
                  onSellClick={() => setIsSellModalOpen(true)} 
                  onCartClick={() => setIsCartModalOpen(true)} 
                />}
                >
                  <Route path="feed" element={<HomeFeed />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="checkout" element={<Checkout />} />
                  {/* Mobile nav routes — redirect to feed for now */}
                  <Route path="categories" element={<HomeFeed />} />
                  <Route path="profile" element={<Navigate to="/login" replace />} />
                </Route>
  
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
