import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import httpService from "../../services/httpService";
import Sidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useTheme } from "../../components/ThemeContext";
import {
  Package,
  Layers,
  Inbox,
  Plus,
  ArrowRight,
  TrendingUp,
  Tag,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [productCount, setProductCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // Handle Window Resize for Smartphones (<640px), Tablets (640-1024px), Laptops (>1024px)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isPhone = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isMobile = windowWidth < 1024;

  // Fetch Menus
  useEffect(() => {
    let isMounted = true;
    const fetchMenus = async () => {
      try {
        setNavLoading(true);
        const role = (localStorage.getItem("userRole") || "ADMIN").toUpperCase();
        const response = await httpService.get("/base/menus", { params: { role } });
        const menuData = response?.data?.data || [];
        if (isMounted && Array.isArray(menuData)) {
          const sortedMenus = [...menuData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setNavItems(sortedMenus);
        }
      } catch {
        if (isMounted) setNavItems([]);
      } finally {
        if (isMounted) setNavLoading(false);
      }
    };
    fetchMenus();
    return () => { isMounted = false; };
  }, []);

  // Fetch Quick Stats
  useEffect(() => {
    let isMounted = true;
    const fetchOverviewData = async () => {
      try {
        setLoadingStats(true);
        const [prodRes, enqRes] = await Promise.allSettled([
          httpService.get("/base/getProducts"),
          httpService.get("/api/enquiry/all")
        ]);

        if (!isMounted) return;

        if (prodRes.status === "fulfilled") {
          const prods = prodRes.value?.data?.data || prodRes.value?.data || [];
          if (Array.isArray(prods)) setProductCount(prods.length);
        }

        if (enqRes.status === "fulfilled") {
          const enqs = Array.isArray(enqRes.value?.data) ? enqRes.value.data : [];
          setEnquiryCount(enqs.length);
          setNewEnquiryCount(enqs.filter(e => (e.status || "").toLowerCase() === "new").length);
        }
      } catch (err) {
        console.error("Dashboard overview error:", err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    fetchOverviewData();
    return () => { isMounted = false; };
  }, []);

  const isDark = isDarkMode;
  const shellBg = isDark ? "#070d1e" : "#f8fafc";
  const cardBg = isDark ? "#0e1830" : "#ffffff";
  const borderColor = isDark ? "#192b50" : "#e2e8f0";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const subTextColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      maxHeight: "100vh",
      overflow: "hidden",
      backgroundColor: shellBg,
      color: textColor,
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* ─── SIDEBAR ─── */}
      <Sidebar
        navItems={navItems}
        loading={navLoading}
        activePath={location.pathname}
        onNavigate={(path) => { if (path) navigate(path); }}
      />

      {/* ─── MAIN COLUMN ─── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minWidth: 0,
        overflow: "hidden"
      }}>
        {/* ─── TOPBAR ─── */}
        <AdminTopbar
          user={{ name: localStorage.getItem("userName") || "Admin User", avatar: null }}
          onSearch={(query) => {}}
          onLogout={() => { localStorage.clear(); sessionStorage.clear(); navigate("/", { replace: true }); }}
        />

        {/* ─── CONTENT ─── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "16px" : "32px",
          boxSizing: "border-box"
        }}>
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: textColor, letterSpacing: "-0.02em" }}>
              Welcome Back, Admin
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: subTextColor }}>
              Here is what is happening across your products, inventory, and customer enquiries today.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isPhone ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: isPhone ? "12px" : "20px",
            marginBottom: "32px"
          }}>
            {/* Products Card */}
            <div
              onClick={() => navigate("/admin/products")}
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: subTextColor, textTransform: "uppercase" }}>Products Catalog</span>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Package size={20} />
                </div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: textColor, margin: "12px 0 4px" }}>
                {loadingStats ? "..." : productCount}
              </div>
              <div style={{ fontSize: "12px", color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                Manage Catalog <ArrowRight size={13} />
              </div>
            </div>

            {/* Enquiries Card */}
            <div
              onClick={() => navigate("/admin/enquiries")}
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: subTextColor, textTransform: "uppercase" }}>Total Enquiries</span>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(249, 115, 22, 0.12)",
                  color: "#f97316",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Inbox size={20} />
                </div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: textColor, margin: "12px 0 4px" }}>
                {loadingStats ? "..." : enquiryCount}
              </div>
              <div style={{ fontSize: "12px", color: "#f97316", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                View All Enquiries <ArrowRight size={13} />
              </div>
            </div>

            {/* New Leads Card */}
            <div
              onClick={() => navigate("/admin/enquiries")}
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: subTextColor, textTransform: "uppercase" }}>New Actionable Leads</span>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Clock size={20} />
                </div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#f59e0b", margin: "12px 0 4px" }}>
                {loadingStats ? "..." : newEnquiryCount}
              </div>
              <div style={{ fontSize: "12px", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                Respond to Leads <ArrowRight size={13} />
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "16px",
            padding: isPhone ? "16px" : "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px", color: textColor }}>
              Quick Administrative Actions
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: "14px"
            }}>
              {[
                { title: "Add New Product", desc: "Create product with specs and pricing", path: "/admin/products/add", icon: <Plus size={18} /> },
                { title: "View Enquiries", desc: "Respond to customer quotation requests", path: "/admin/enquiries", icon: <Inbox size={18} /> },
                { title: "Manage Categories", desc: "Define category filters & spec fields", path: "/admin/add-category", icon: <Layers size={18} /> },
                { title: "Manage Brands", desc: "Add brand logos & manufacturer info", path: "/admin/add-brand", icon: <Tag size={18} /> }
              ].map((act, i) => (
                <button
                  key={i}
                  onClick={() => navigate(act.path)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${borderColor}`,
                    background: isDark ? "#080e1e" : "#f8fafc",
                    color: textColor,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(249, 115, 22, 0.12)",
                    color: "#f97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {act.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: textColor }}>{act.title}</div>
                  <div style={{ fontSize: "12px", color: subTextColor, lineHeight: 1.4 }}>{act.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}