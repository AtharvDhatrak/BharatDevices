import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import httpService from "../../services/httpService";
import { useTheme } from "../../components/ThemeContext";

export default function AdminAddBrand() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Navigation & Shell States
  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);

  // Form & Brand States
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const [brandId, setBrandId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle Window Resize for Responsive Layout adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Navigation Menu
  useEffect(() => {
    let mounted = true;
    const fetchMenus = async () => {
      try {
        const role = (localStorage.getItem("userRole") || "ADMIN").toUpperCase();
        const res = await httpService.get("/base/menus", { params: { role } });
        const data = res?.data?.data || [];
        if (mounted && Array.isArray(data)) {
          setNavItems([...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
      } catch {
        if (mounted) setNavItems([]);
      } finally {
        if (mounted) setNavLoading(false);
      }
    };
    fetchMenus();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch Brands List
  useEffect(() => {
    let mounted = true;

    const fetchBrandsList = async () => {
      try {
        // Adjust endpoint if your backend route differs (e.g., /base/getBrands)
        const res = await httpService.get("/base/getBrands");
        const data = res?.data?.data || res?.data || [];
        if (mounted && Array.isArray(data)) {
          setBrands(data);
        }
      } catch (err) {
        console.error("Network error fetching brands:", err);
      }
    };

    fetchBrandsList();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchBrandsList = async () => {
    try {
      const res = await httpService.get("/base/getBrands");
      const data = res?.data?.data || res?.data || [];
      if (Array.isArray(data)) {
        setBrands(data);
      }
    } catch (err) {
      console.error("Error refreshing brands:", err);
    }
  };

  const handleSelectBrand = (brand) => {
    if (!brand) {
      resetForm();
      return;
    }
    setSelectedBrandId(brand.id || brand._id);
    setBrandId(brand.id || brand._id || "");
    setBrandName(brand.name || "");
    setLogoUrl(brand.logoUrl || "");
    setDescription(brand.description || "");
    setStatusMsg({ type: "", text: "" });
  };

  const resetForm = () => {
    setSelectedBrandId(null);
    setBrandId("");
    setBrandName("");
    setLogoUrl("");
    setDescription("");
    setStatusMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (!brandName.trim()) {
      setStatusMsg({ type: "error", text: "Configuration Error: Brand Name is required." });
      return;
    }

    setLoading(true);

    const payload = {
      ...(selectedBrandId ? { id: selectedBrandId } : {}),
      name: brandName.trim(),
      logoUrl: logoUrl.trim(),
      description: description.trim(),
    };

    try {
      const res = await httpService.post("/base/saveBrand", payload);

      const isSuccess = res?.data?.success === true || res?.success === true || res?.data?.status === "success" || res?.status === 200;

      if (isSuccess) {
        setStatusMsg({
          type: "success",
          text: `Success: Brand "${brandName}" saved successfully!`,
        });
        fetchBrandsList();
        if (!selectedBrandId) {
          resetForm();
        }
      } else {
        throw new Error(res?.data?.message || res?.message || "Operation failed.");
      }
    } catch (err) {
      console.error("Submission error details:", err);
      setStatusMsg({ 
        type: "error", 
        text: err?.response?.data?.message || err?.message || "Failed to save brand. Please check your data configurations." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Theme Colors matching AdminAddCategories
  const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
  const textColor = isDarkMode ? "#f8fafc" : "#0f172a";
  const subTextColor = isDarkMode ? "#94a3b8" : "#64748b";
  const borderColor = isDarkMode ? "#334155" : "#e2e8f0";
  const inputBg = isDarkMode ? "#0f172a" : "#ffffff";

  const styles = {
    shell: {
      display: "flex",
      height: "100vh",
      maxHeight: "100vh",
      overflow: "hidden",
      backgroundColor: isDarkMode ? "#0b1329" : "#f8fafc",
      color: textColor,
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minWidth: 0,
      width: "100%",
      overflow: "hidden",
    },
    content: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
      padding: isMobile ? "12px" : "20px",
      width: "100%",
      maxWidth: "1400px",
      margin: "0 auto",
      boxSizing: "border-box",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "minmax(240px, 280px) minmax(0, 1fr)",
      gap: "20px",
      alignItems: "start",
      width: "100%",
      boxSizing: "border-box",
    },
  };

  return (
    <div style={styles.shell}>
      <Sidebar
        navItems={navItems}
        loading={navLoading}
        activePath={location.pathname}
        onNavigate={(path) => {
          if (path) navigate(path);
        }}
      />

      <div style={styles.main}>
        <AdminTopbar
          user={{
            name: localStorage.getItem("userName") || "Admin User",
            avatar: null,
          }}
          notificationCount={6}
          messageCount={2}
          onSearch={(query) => console.log("Search:", query)}
          onLogout={() => {
            localStorage.clear();
            navigate("/login");
          }}
        />

        <div style={styles.content} className="no-scrollbar">
          {/* Responsive Header Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: "700", margin: 0 }}>Brand Manager</h1>
              <p style={{ fontSize: "13px", color: subTextColor, margin: "4px 0 0 0" }}>
                Create and manage product brands, logos, and descriptions.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: isDarkMode ? "#334155" : "#e2e8f0",
                color: textColor,
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                whiteSpace: "nowrap",
                width: isMobile ? "100%" : "auto",
              }}
            >
              + Create New Brand
            </button>
          </div>

          {statusMsg.text && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                backgroundColor: statusMsg.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
                color: statusMsg.type === "error" ? "#ef4444" : "#22c55e",
                border: `1px solid ${statusMsg.type === "error" ? "#ef4444" : "#22c55e"}`,
                fontSize: "14px",
              }}
            >
              {statusMsg.text}
            </div>
          )}

          {/* Main Grid Layout with Smartphone/Laptop Adapters */}
          <div style={styles.gridContainer}>
            
            {/* Left Column: Sidebar List of Brands */}
            <div style={{ backgroundColor: cardBg, padding: "16px", borderRadius: "10px", border: `1px solid ${borderColor}`, minWidth: 0 }}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px" }}>Existing Brands</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: isMobile ? "200px" : "none", overflowY: isMobile ? "auto" : "visible" }}>
                {brands.length === 0 ? (
                  <div style={{ fontSize: "13px", color: subTextColor, padding: "8px 0" }}>No brands found.</div>
                ) : (
                  brands.map((brand) => {
                    const bId = brand.id || brand._id;
                    const isSelected = selectedBrandId === bId;
                    return (
                      <button
                        key={bId || brand.name}
                        type="button"
                        onClick={() => handleSelectBrand(brand)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "6px",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: isSelected ? "#F97316" : "transparent",
                          color: isSelected ? "#ffffff" : textColor,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: isSelected ? "600" : "400",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{brand.name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Brand Form */}
            <form onSubmit={handleSubmit} style={{ backgroundColor: cardBg, padding: isMobile ? "14px" : "20px", borderRadius: "10px", border: `1px solid ${borderColor}`, minWidth: 0, boxSizing: "border-box" }}>
              
              <h2 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "16px" }}>
                {selectedBrandId ? `Edit Brand: ${brandName}` : "Create New Brand"}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dell, HP, Samsung"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Logo URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                  />
                  {logoUrl && (
                    <div style={{ marginTop: "8px" }}>
                      <img
                        src={logoUrl}
                        alt="Brand logo preview"
                        style={{ height: "48px", objectFit: "contain", border: `1px solid ${borderColor}`, borderRadius: "6px", padding: "4px", backgroundColor: inputBg }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Description</label>
                  <textarea
                    rows={4}
                    placeholder="Short description about this brand"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box", resize: "vertical" }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    backgroundColor: "#22c55e",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: loading ? "not-allowed" : "pointer",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {loading ? "Saving Brand..." : "Save Brand"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}