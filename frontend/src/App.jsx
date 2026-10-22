import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext'; 

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Enquiry = lazy(() => import('./pages/Enquiry'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminAddProduct = lazy(() => import('./pages/Admin/AdminAddProduct'));
const AuthModal = lazy(() => import('./pages/AuthModal'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminAddCategory = lazy(() => import('./pages/Admin/AdminAddCategories'));
const AdminAllProducts = lazy(() => import('./pages/Admin/AdminProductsTable'));
const AdminAddBrand = lazy(() => import('./pages/Admin/AdminAddBrand'));
const AdminEnquiries = lazy(() => import('./pages/Admin/AdminEnquiries'));
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#64748b' }}>
    Loading...
  </div>
);

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/login';

  if (isAdmin || isLogin) {
    return (
      <>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<AuthModal />} />
            <Route path="/admin/products/add" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
            <Route path="/admin/products" element={<ProtectedAdminRoute><AdminAllProducts /></ProtectedAdminRoute>} />
            <Route path="/admin/add-category" element={<ProtectedAdminRoute><AdminAddCategory /></ProtectedAdminRoute>} />
            <Route path="/admin/add-brand" element={<ProtectedAdminRoute><AdminAddBrand /></ProtectedAdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
            <Route path="/admin/enquiries" element={<ProtectedAdminRoute><AdminEnquiries /></ProtectedAdminRoute>} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/:tab/*" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          </Routes>
        </Suspense>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <TopBar />
      <Navbar />
      <div style={{ paddingBottom: 'var(--mobile-nav-height, 0)' }}>
        <div key={pathname} className="page-transition-wrap">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}