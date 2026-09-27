import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import httpService from "../../services/httpService";
import Sidebar from "./AdminSidebar";
import AdminEnquiries from "./AdminEnquiries";

const DashboardHome = () => (
  <div style={{ color: "#f8fafc" }}>
    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Dashboard Overview</h2>
    <div style={{ background: "#0e1e38", padding: "1.5rem", borderRadius: "8px", border: "1px solid #132a52" }}>
      Welcome to the Admin Dashboard.
    </div>
  </div>
);

const ProductsList = () => (
  <div style={{ color: "#f8fafc" }}>
    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Products List</h2>
    <div style={{ background: "#0e1e38", padding: "1.5rem", borderRadius: "8px", border: "1px solid #132a52", color: "#94a3b8" }}>
      Product table / list view goes here.
    </div>
  </div>
);

function renderPage(pathname) {
  if (pathname.includes('/enquiries')) return <AdminEnquiries />;
if (pathname === '/admin' || pathname.includes('/dashboard')) return <DashboardHome />;
  if (pathname.includes('/products')) return <ProductsList />;
  return <DashboardHome />;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMenus = async () => {
      try {
        setLoading(true);
        const rawRole = localStorage.getItem("userRole") || "ADMIN";
        const role = rawRole.toUpperCase();

        const response = await httpService.get("/base/menus", { params: { role } });
        const menuData = response?.data?.data || [];

        if (!isMounted) return;

        if (Array.isArray(menuData)) {
          const sortedMenus = [...menuData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setNavItems(sortedMenus);
        } else {
          setNavItems([]);
        }
      } catch (error) {
        if (isMounted) setNavItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMenus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (path) => {
    if (path) navigate(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050c1a" }}>
      {/* SEPARATE SIDEBAR ELEMENT */}
      <Sidebar
        navItems={navItems}
        loading={loading}
        activePath={location.pathname}
        onNavigate={handleNavigate}
      />

      {/* MAIN ROUTE CONTENT */}
      <main style={{ flex: 1, padding: "2rem", background: "#050c1a" }}>
        {renderPage(location.pathname)}
      </main>
    </div>
  );
}