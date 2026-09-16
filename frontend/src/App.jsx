import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Enquiry = lazy(() => import('./pages/Enquiry'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAddProduct = lazy(() => import('./pages/AdminAddProduct'));
const AuthModal = lazy(() => import('./pages/AuthModal'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#64748b' }}>
    Loading...
  </div>
);

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/login';

  if (isAdmin || isLogin) {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<AuthModal />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminAddProduct />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:tab/*" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <div style={{ paddingBottom: 'var(--mobile-nav-height, 0)' }}>
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
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
