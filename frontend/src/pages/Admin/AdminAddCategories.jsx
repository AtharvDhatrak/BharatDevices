import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Admin/AdminSidebar";
import AdminTopbar from "../Admin/AdminTopbar"; 
import httpService from "../../services/httpService";
import { useTheme } from "../../components/ThemeContext";

const FIELD_TYPES = [
  { label: "Dropdown Select (Single)", value: "select" },
  { label: "Multi-Select (Generates SKUs)", value: "multiselect" },
  { label: "Checkboxes (In-The-Box Items)", value: "checkbox_group" },
  { label: "Number Input (e.g. Battery hrs, Weight)", value: "number" },
  { label: "Text Field", value: "text" },
];

export default function AdminAddCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Navigation & Shell States
  const [navItems, setNavItems] = useState([]);
  const [navLoading, setNavLoading] = useState(true);

  // Form & Category States
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [specDefinitions, setSpecDefinitions] = useState([]);
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

  // Fetch Categories
  useEffect(() => {
    let mounted = true;

    const fetchCategoriesList = async () => {
      try {
        const res = await httpService.get("/base/getCategories");
        const data = res?.data?.data || res?.data || [];
        if (mounted && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Network error fetching categories:", err);
      }
    };

    fetchCategoriesList();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchCategoriesList = async () => {
    try {
      const res = await httpService.get("/base/getCategories");
      const data = res?.data?.data || res?.data || [];
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Error refreshing categories:", err);
    }
  };

  const handleSelectCategory = (cat) => {
    if (!cat) {
      resetForm();
      return;
    }
    setSelectedCategoryId(cat.id);
    setCategoryId(cat.id);
    setCategoryName(cat.name);
    
    // Map existing specs and convert options array into string representation for optionsText
    const rawSpecs = cat.specDefinitions || cat.spec_definitions || [];
    const formattedSpecs = rawSpecs.map((spec) => ({
      ...spec,
      optionsText: Array.isArray(spec.options) ? spec.options.join(", ") : "",
    }));

    setSpecDefinitions(formattedSpecs);
    setStatusMsg({ type: "", text: "" });
  };

  const resetForm = () => {
    setSelectedCategoryId(null);
    setCategoryId("");
    setCategoryName("");
    setSpecDefinitions([]);
    setStatusMsg({ type: "", text: "" });
  };

  const handleAddSpecField = () => {
    setSpecDefinitions((prev) => [
      ...prev,
      {
        key: "",
        label: "",
        type: "select",
        optionsText: "",
        options: [],
        isVariant: false,
        isRequired: false,
      },
    ]);
  };

  const handleSpecChange = (index, field, value) => {
    setSpecDefinitions((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      if (field === "label" && !updated[index].key) {
        row.key = value.toLowerCase().replace(/[^a-z0-9]/g, "_");
      }

      if (field === "optionsText") {
        row.optionsText = value;
        row.options = value
          .split(",")
          .map((opt) => opt.trim())
          .filter((opt) => opt !== "");
      }

      if (field === "type" && value === "multiselect") {
        row.isVariant = true;
      }

      updated[index] = row;
      return updated;
    });
  };

  const handleRemoveSpecField = (index) => {
    setSpecDefinitions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (!categoryId.trim()) {
      setStatusMsg({ type: "error", text: "Configuration Error: Category ID (System Key) cannot be blank." });
      return;
    }
    if (!categoryName.trim()) {
      setStatusMsg({ type: "error", text: "Configuration Error: Category Name is required." });
      return;
    }

    const formattedCategoryId = categoryId.trim().toLowerCase().replace(/\s+/g, "_");
    if (!/^[a-z0-9_]+$/.test(formattedCategoryId)) {
      setStatusMsg({ 
        type: "error", 
        text: "Validation Error: Category ID can only contain lowercase letters, numbers, and underscores." 
      });
      return;
    }

    for (let i = 0; i < specDefinitions.length; i++) {
      const spec = specDefinitions[i];
      const rowNum = i + 1;

      if (!spec.label || !spec.label.trim()) {
        setStatusMsg({ type: "error", text: `Validation Error: Specification row #${rowNum} is missing a Field Label.` });
        return;
      }
      if (!spec.key || !spec.key.trim()) {
        setStatusMsg({ type: "error", text: `Validation Error: Specification row #${rowNum} is missing a Field Key.` });
        return;
      }

      if (["select", "multiselect", "checkbox_group"].includes(spec.type)) {
        const optionList = spec.optionsText ? spec.optionsText.split(",").map(o => o.trim()).filter(Boolean) : (spec.options || []);
        if (optionList.length === 0) {
          setStatusMsg({ 
            type: "error", 
            text: `Validation Error: Field "${spec.label}" requires at least one option.` 
          });
          return;
        }
      }
    }

    setLoading(true);

    const cleanedSpecs = specDefinitions.map(({ optionsText, ...rest }) => ({
      ...rest,
      key: rest.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
      label: rest.label.trim(),
      options: Array.isArray(rest.options) ? rest.options : [],
    }));

    const payload = {
      id: formattedCategoryId,
      name: categoryName.trim(),
      specDefinitions: cleanedSpecs,
    };

    try {
      const res = await httpService.post("/base/saveCategory", payload);

      // Handle standard response wrapper formats: res.data.success or top-level res.success
      const isSuccess = res?.data?.success === true || res?.success === true || res?.data?.status === "success";

      if (isSuccess) {
        setStatusMsg({
          type: "success",
          text: `Success: Category "${categoryName}" schema saved successfully!`,
        });
        fetchCategoriesList();
      } else {
        throw new Error(res?.data?.message || res?.message || "Operation failed.");
      }
    } catch (err) {
      console.error("Submission error details:", err);
      setStatusMsg({ 
        type: "error", 
        text: err?.message || "Failed to save category. Please check your data configurations." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Theme Colors
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
              <h1 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: "700", margin: 0 }}>Category & Specification Manager</h1>
              <p style={{ fontSize: "13px", color: subTextColor, margin: "4px 0 0 0" }}>
                Create dynamic specification schemas for cameras, laptops, audio gear, and displays.
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
              + Create New Category
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
            
            {/* Left Column: Sidebar List of Categories */}
            <div style={{ backgroundColor: cardBg, padding: "16px", borderRadius: "10px", border: `1px solid ${borderColor}`, minWidth: 0 }}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px" }}>Existing Categories</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: isMobile ? "200px" : "none", overflowY: isMobile ? "auto" : "visible" }}>
                {categories.length === 0 ? (
                  <div style={{ fontSize: "13px", color: subTextColor, padding: "8px 0" }}>No categories found.</div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "6px",
                        textAlign: "left",
                        border: "none",
                        backgroundColor: selectedCategoryId === cat.id ? "#2563eb" : "transparent",
                        color: selectedCategoryId === cat.id ? "#ffffff" : textColor,
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: selectedCategoryId === cat.id ? "600" : "400",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}</span>
                      <span style={{ fontSize: "11px", opacity: 0.7, marginLeft: "6px" }}>
                        {((cat.specDefinitions || cat.spec_definitions) || []).length} specs
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Schema Configuration Form */}
            <form onSubmit={handleSubmit} style={{ backgroundColor: cardBg, padding: isMobile ? "14px" : "20px", borderRadius: "10px", border: `1px solid ${borderColor}`, minWidth: 0, boxSizing: "border-box" }}>
              
              <h2 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "16px" }}>
                {selectedCategoryId ? `Edit Category: ${categoryName}` : "Create New Category Template"}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Professional Cameras"
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      if (!selectedCategoryId) setCategoryId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                    }}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Category ID (System Key) *</label>
                  <input
                    type="text"
                    placeholder="e.g. cameras"
                    value={categoryId}
                    disabled={Boolean(selectedCategoryId)}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{ width: "100%", padding: "9px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box", opacity: selectedCategoryId ? 0.6 : 1 }}
                  />
                </div>
              </div>

              <hr style={{ border: "none", borderTop: `1px solid ${borderColor}`, margin: "20px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>Specification Definitions</h3>
                <button
                  type="button"
                  onClick={handleAddSpecField}
                  style={{ padding: "8px 14px", borderRadius: "6px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "12px", width: isMobile ? "100%" : "auto" }}
                >
                  + Add Specification Field
                </button>
              </div>

              {specDefinitions.length === 0 ? (
                <div style={{ padding: "28px", textAlign: "center", border: `2px dashed ${borderColor}`, borderRadius: "8px", color: subTextColor, fontSize: "13px" }}>
                  No specifications defined yet. Click "+ Add Specification Field" to start.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {specDefinitions.map((spec, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: `1px solid ${borderColor}`,
                        backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(140px, 1fr)) 36px", gap: "10px", alignItems: "center" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: subTextColor, marginBottom: "4px" }}>FIELD LABEL</label>
                          <input
                            type="text"
                            placeholder="e.g. Lens Mount Type"
                            value={spec.label}
                            onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                            style={{ width: "100%", padding: "7px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: subTextColor, marginBottom: "4px" }}>FIELD KEY</label>
                          <input
                            type="text"
                            placeholder="lens_mount_type"
                            value={spec.key}
                            onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                            style={{ width: "100%", padding: "7px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: subTextColor, marginBottom: "4px" }}>INPUT TYPE</label>
                          <select
                            value={spec.type}
                            onChange={(e) => handleSpecChange(idx, "type", e.target.value)}
                            style={{ width: "100%", padding: "7px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                          >
                            {FIELD_TYPES.map((ft) => (
                              <option key={ft.value} value={ft.value}>{ft.label}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSpecField(idx)}
                          style={{ marginTop: isMobile ? "4px" : "16px", background: "none", border: "none", color: "#ef4444", fontSize: "16px", cursor: "pointer", justifySelf: isMobile ? "start" : "center" }}
                          title="Delete Field"
                        >
                          🗑️ Delete Field
                        </button>
                      </div>

                      {["select", "multiselect", "checkbox_group"].includes(spec.type) && (
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: subTextColor, marginBottom: "4px" }}>
                            OPTIONS (Comma-separated values)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sony E-Mount, Canon RF, Nikon Z"
                            value={spec.optionsText ?? ""}
                            onChange={(e) => handleSpecChange(idx, "optionsText", e.target.value)}
                            style={{ width: "100%", padding: "7px", borderRadius: "6px", border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, boxSizing: "border-box" }}
                          />
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "12px", paddingTop: "2px", flexWrap: "wrap" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={spec.isVariant}
                            onChange={(e) => handleSpecChange(idx, "isVariant", e.target.checked)}
                          />
                          <span>Is Dynamic Variant (Generates SKU Combinations)</span>
                        </label>

                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={spec.isRequired}
                            onChange={(e) => handleSpecChange(idx, "isRequired", e.target.checked)}
                          />
                          <span>Required Field</span>
                        </label>
                      </div>

                    </div>
                  ))}
                </div>
              )}

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
                  {loading ? "Saving Schema..." : "Save Category Schema"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}