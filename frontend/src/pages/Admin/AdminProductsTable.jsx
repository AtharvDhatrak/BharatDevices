import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import AdminTopbar from "../../pages/Admin/AdminTopbar";
import httpService from "../../services/httpService";
import { useTheme } from "../../components/ThemeContext";
import { 
  Package, 
  Tag, 
  Cpu, 
  HardDrive, 
  Maximize2, 
  Battery, 
  Image as ImageIcon,
  Search,
  Plus,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  DollarSign
} from "lucide-react";

export default function AdminProductsTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);

  // Products and UI States
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Modal State for Full Product View
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Handle Window Resize for Mobile Responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Navigation Menus
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
    return () => { mounted = false; };
  }, []);

  // Fetch Products Catalog
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await httpService.get("/base/getProducts");
        const data = res?.data?.data || res?.data || [];
        if (mounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, []);

  // Safe parser helper for database jsonb structures (handles object value wrapper, strings, or arrays)
  const parseJsonbField = (field, fallback = {}) => {
    try {
      if (!field) return fallback;
      let target = field;
      if (typeof field === "object" && "value" in field) {
        target = field.value;
      }
      if (typeof target === "string") {
        return JSON.parse(target);
      }
      return target || fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((p) => {
    const titleMatch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = p.category_id?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || brandMatch || categoryMatch;
  });

  // Dynamic Theme Colors
  const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
  const textColor = isDarkMode ? "#f8fafc" : "#0f172a";
  const subTextColor = isDarkMode ? "#94a3b8" : "#64748b";
  const borderColor = isDarkMode ? "#334155" : "#e2e8f0";
  const modalBg = isDarkMode ? "#0f172a" : "#ffffff";

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
      overflow: "hidden",
    },
    content: {
      flex: 1,
      overflowY: "auto",
      padding: isMobile ? "16px" : "32px",
      fontFamily: "system-ui, sans-serif",
    },
    pageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      marginBottom: "24px",
      flexDirection: isMobile ? "column" : "row",
      gap: "16px",
    },
    pageTitle: { fontSize: "24px", fontWeight: "bold", color: textColor, margin: 0 },
    pageSubtitle: { fontSize: "14px", color: subTextColor, margin: "4px 0 0 0" },
    addButton: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "20px",
    },
    productCard: {
      backgroundColor: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    imageContainer: {
      height: "160px",
      backgroundColor: isDarkMode ? "#0f172a" : "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      borderBottom: `1px solid ${borderColor}`,
    },
    categoryPill: {
      position: "absolute",
      top: "12px",
      right: "12px",
      backgroundColor: isDarkMode ? "rgba(79, 70, 229, 0.2)" : "#eef2ff",
      color: "#4f46e5",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    cardBody: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      flex: 1,
    },
    productHeaderRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    productTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: textColor,
      margin: 0,
    },
    brandLabel: {
      fontSize: "12px",
      color: subTextColor,
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    specsBox: {
      backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
      borderRadius: "8px",
      padding: "12px",
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    specRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "12px",
    },
    specKey: {
      color: subTextColor,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 500,
    },
    specValueChips: {
      display: "flex",
      gap: "4px",
      flexWrap: "wrap",
      justifyContent: "flex-end",
    },
    chip: {
      backgroundColor: isDarkMode ? "#1e293b" : "#e2e8f0",
      color: textColor,
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "600",
    },
    emptyState: {
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "64px 0",
      color: subTextColor,
      fontSize: "15px",
    },
    // Modal Styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: isMobile ? "10px" : "20px",
    },
    modalContent: {
      backgroundColor: modalBg,
      border: `1px solid ${borderColor}`,
      borderRadius: "16px",
      width: "100%",
      maxWidth: "900px",
      maxHeight: "90vh",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      position: "relative",
    },
    modalHeader: {
      padding: "20px 24px",
      borderBottom: `1px solid ${borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      backgroundColor: modalBg,
      zIndex: 10,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: subTextColor,
      cursor: "pointer",
      padding: "6px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBody: {
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    carouselSection: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    mainImageFrame: {
      height: "280px",
      backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      border: `1px solid ${borderColor}`,
    },
    thumbnailRow: {
      display: "flex",
      gap: "10px",
      overflowX: "auto",
      paddingBottom: "4px",
    },
    thumbnail: (isActive) => ({
      width: "64px",
      height: "64px",
      borderRadius: "8px",
      objectFit: "cover",
      cursor: "pointer",
      border: isActive ? "2px solid #4f46e5" : `1px solid ${borderColor}`,
      opacity: isActive ? 1 : 0.6,
      transition: "all 0.2s ease",
      flexShrink: 0,
    }),
    metaGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: "12px",
    },
    metaCard: {
      backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
      padding: "12px",
      borderRadius: "10px",
      border: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    metaTitle: { fontSize: "11px", color: subTextColor, fontWeight: 500, textTransform: "uppercase" },
    metaValue: { fontSize: "14px", fontWeight: 600, color: textColor },
    variantsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "8px",
      fontSize: "13px",
    },
    tableHeaderTh: {
      textAlign: "left",
      padding: "10px 12px",
      borderBottom: `2px solid ${borderColor}`,
      color: subTextColor,
      fontSize: "11px",
      textTransform: "uppercase",
    },
    tableRowTd: {
      padding: "12px",
      borderBottom: `1px solid ${borderColor}`,
      color: textColor,
    },
    modalFooter: {
      padding: "16px 24px",
      borderTop: `1px solid ${borderColor}`,
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      backgroundColor: modalBg,
      position: "sticky",
      bottom: 0,
    },
    editModalButton: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    }
  };

  return (
    <div style={styles.shell}>
      <Sidebar
        navItems={navItems}
        loading={navLoading}
        activePath={location.pathname}
        onNavigate={(path) => { if (path) navigate(path); }}
      />

      <div style={styles.main}>
        <AdminTopbar
          user={{ name: localStorage.getItem("userName") || "Admin User", avatar: null }}
          notificationCount={6}
          messageCount={2}
          onSearch={(query) => setSearchQuery(query)}
          onLogout={() => { localStorage.clear(); navigate("/login"); }}
        />

        <div style={styles.content}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Catalog Overview</h1>
              <p style={styles.pageSubtitle}>Examine product variants, stock breakdown, and pricing matrix configurations.</p>
            </div>
            <button style={styles.addButton} onClick={() => navigate("/admin/products/add")}>
  <Plus size={16} /> Add New Product
</button>
          </div>

          {/* Product Grid View */}
          {loadingProducts ? (
            <div style={{ textAlign: "center", padding: "64px", color: subTextColor }}>Loading visual catalog...</div>
          ) : (
            <div style={styles.gridContainer}>
              {filteredProducts.length === 0 ? (
                <div style={styles.emptyState}>No products found matching your search.</div>
              ) : (
                filteredProducts.map((product) => {
                  const specs = parseJsonbField(product.specifications);
                  const images = parseJsonbField(product.image_urls, []);
                  const primaryImage = images[0];
                  const variants = product.variants || [];

                  // Calculate min/max price from variants if available
                  const prices = variants.map(v => v.price).filter(p => p != null);
                  const minPrice = prices.length ? Math.min(...prices) : null;

                  return (
                    <div 
                      key={product.id} 
                      style={styles.productCard}
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveImageIndex(0);
                      }}
                    >
                      {/* Image / Banner Header Display */}
                      <div style={styles.imageContainer}>
                        {primaryImage ? (
                          <img src={primaryImage} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageIcon size={36} color={subTextColor} />
                        )}
                        <span style={styles.categoryPill}>{product.category_id || "Uncategorized"}</span>
                      </div>

                      {/* Card Content */}
                      <div style={styles.cardBody}>
                        <div>
                          <div style={styles.productHeaderRow}>
                            <h3 style={styles.productTitle}>{product.title}</h3>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                            <span style={styles.brandLabel}>
                              <Tag size={12} /> <strong>{product.brand || "Generic"}</strong>
                            </span>
                            {minPrice !== null && (
                              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4f46e5" }}>
                                From ₹{minPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Parsed JSON Specifications Section */}
                        <div style={styles.specsBox}>
                          <div style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: subTextColor, marginBottom: "4px" }}>
                            Dynamic Specifications ({variants.length} Variants)
                          </div>
                          
                          {Object.keys(specs).length === 0 ? (
                            <span style={{ fontSize: "12px", color: subTextColor, fontStyle: "italic" }}>No specifications mapped.</span>
                          ) : (
                            Object.entries(specs).slice(0, 3).map(([key, val]) => (
                              <div key={key} style={styles.specRow}>
                                <span style={styles.specKey}>
                                  {key === "RAM" && <Cpu size={12} />}
                                  {key === "ROM" && <HardDrive size={12} />}
                                  {key === "screen size" && <Maximize2 size={12} />}
                                  {key === "battery backup" && <Battery size={12} />}
                                  {key}:
                                </span>
                                <div style={styles.specValueChips}>
                                  {Array.isArray(val) ? (
                                    val.map((item, idx) => <span key={idx} style={styles.chip}>{item}</span>)
                                  ) : (
                                    <span style={styles.chip}>{val || "N/A"}</span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Detailed Product Modal / Drawer */}
          {selectedProduct && (() => {
            const specs = parseJsonbField(selectedProduct.specifications);
            const images = parseJsonbField(selectedProduct.image_urls, []);
            const variants = selectedProduct.variants || [];

            return (
              <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  
                  {/* Modal Header */}
                  <div style={styles.modalHeader}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "bold", textTransform: "uppercase" }}>
                        {selectedProduct.category_id || "Product Details"}
                      </span>
                      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: textColor, margin: "2px 0 0 0" }}>
                        {selectedProduct.title}
                      </h2>
                    </div>
                    <button style={styles.closeButton} onClick={() => setSelectedProduct(null)}>
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div style={styles.modalBody}>
                    
                    {/* Image Carousel Component */}
                    <div style={styles.carouselSection}>
                      <div style={styles.mainImageFrame}>
                        {images.length > 0 && images[activeImageIndex] ? (
                          <img 
                            src={images[activeImageIndex]} 
                            alt="Product view" 
                            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                          />
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: subTextColor }}>
                            <ImageIcon size={48} />
                            <span>No general images available</span>
                          </div>
                        )}

                        {images.length > 1 && (
                          <>
                            <button 
                              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                              style={{ position: "absolute", left: "10px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", padding: "6px", cursor: "pointer" }}
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button 
                              onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                              style={{ position: "absolute", right: "10px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", padding: "6px", cursor: "pointer" }}
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails */}
                      {images.length > 1 && (
                        <div style={styles.thumbnailRow}>
                          {images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt={`Thumb ${idx}`} 
                              style={styles.thumbnail(idx === activeImageIndex)}
                              onClick={() => setActiveImageIndex(idx)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Metadata Grid */}
                    <div style={styles.metaGrid}>
                      <div style={styles.metaCard}>
                        <span style={styles.metaTitle}>Brand</span>
                        <span style={styles.metaValue}>{selectedProduct.brand || "Generic"}</span>
                      </div>
                      <div style={styles.metaCard}>
                        <span style={styles.metaTitle}>Variants Count</span>
                        <span style={styles.metaValue}>{variants.length} Options</span>
                      </div>
                      <div style={styles.metaCard}>
                        <span style={styles.metaTitle}>Added Date</span>
                        <span style={styles.metaValue}>
                          {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div style={styles.metaCard}>
                        <span style={styles.metaTitle}>Category</span>
                        <span style={styles.metaValue}>{selectedProduct.category_id || "N/A"}</span>
                      </div>
                    </div>

                    {/* Variants Pricing & Stock Matrix Section */}
                    <div style={styles.specsBox}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: subTextColor, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Layers size={14} /> Variant Configurations, Stock & Pricing
                      </div>

                      {variants.length === 0 ? (
                        <span style={{ fontSize: "13px", color: subTextColor, fontStyle: "italic" }}>No variants configured.</span>
                      ) : (
                        <div style={{ overflowX: "auto" }}>
                          <table style={styles.variantsTable}>
                            <thead>
                              <tr>
                                <th style={styles.tableHeaderTh}>SKU</th>
                                <th style={styles.tableHeaderTh}>Combination</th>
                                <th style={styles.tableHeaderTh}>Price</th>
                                <th style={styles.tableHeaderTh}>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variants.map((v) => {
                                const combination = parseJsonbField(v.combination, {});
                                return (
                                  <tr key={v.id}>
                                    <td style={{ ...styles.tableRowTd, fontWeight: 600 }}>{v.sku}</td>
                                    <td style={styles.tableRowTd}>
                                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                        {Object.entries(combination).map(([cKey, cVal]) => (
                                          <span key={cKey} style={styles.chip}>
                                            {cKey}: {cVal}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td style={{ ...styles.tableRowTd, fontWeight: "bold", color: "#4f46e5" }}>
                                      ₹{v.price != null ? Number(v.price).toFixed(2) : "0.00"}
                                    </td>
                                    <td style={styles.tableRowTd}>
                                      <span style={{ 
                                        padding: "2px 8px", 
                                        borderRadius: "12px", 
                                        fontSize: "11px", 
                                        fontWeight: "bold",
                                        backgroundColor: v.stock > 10 ? (isDarkMode ? "rgba(16, 185, 129, 0.2)" : "#d1fae5") : (isDarkMode ? "rgba(239, 68, 68, 0.2)" : "#fee2e2"),
                                        color: v.stock > 10 ? "#10b981" : "#ef4444"
                                      }}>
                                        {v.stock} units
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Full Specifications Section */}
                    <div style={styles.specsBox}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: subTextColor, marginBottom: "8px" }}>
                        Complete Technical Specifications
                      </div>
                      
                      {Object.keys(specs).length === 0 ? (
                        <span style={{ fontSize: "13px", color: subTextColor, fontStyle: "italic" }}>No specifications registered.</span>
                      ) : (
                        Object.entries(specs).map(([key, val]) => (
                          <div key={key} style={{ ...styles.specRow, padding: "6px 0", borderBottom: `1px solid ${borderColor}` }}>
                            <span style={{ ...styles.specKey, textTransform: "capitalize" }}>{key}:</span>
                            <div style={styles.specValueChips}>
                              {Array.isArray(val) ? (
                                val.map((item, idx) => <span key={idx} style={styles.chip}>{item}</span>)
                              ) : (
                                <span style={styles.chip}>{val || "N/A"}</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* Modal Footer */}
                  <div style={styles.modalFooter}>
                    <button 
  style={styles.editModalButton}
  onClick={() => navigate(`/admin/products/edit/${selectedProduct.id}`, { state: { editProduct: selectedProduct } })}
>
  <Edit3 size={16} /> Edit Details & Variants
</button>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}