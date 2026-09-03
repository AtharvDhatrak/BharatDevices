import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy-loaded page components for on-demand bundle loading
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Enquiry = lazy(() => import('./pages/Enquiry'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AuthModal = lazy(() => import('./pages/AuthModal')); // Import AuthModal component

// Minimal loading indicator matched to current theme variables
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    fontWeight: '500'
  }}>
    <span>Loading content...</span>
  </div>
);

// Inner Layout to handle route-specific layouts (e.g. Fullscreen Auth vs Standard Page Container)
function MainLayout({ theme, toggleTheme }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hide Navbar on Login page for full glassmorphic immersion */}
      {!isAuthPage && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      {isAuthPage ? (
        // Fullscreen viewport container for AuthModal
        <main style={{ flex: 1 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<AuthModal />} />
            </Routes>
          </Suspense>
        </main>
      ) : (
        // Standard Responsive Container for normal store pages
        <main className="responsive-container" >
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </main>
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <MainLayout theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}