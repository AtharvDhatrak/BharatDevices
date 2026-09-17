import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../components/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

export default function AdminTopbar({
  user = { name: "Admin User", avatar: null },
  notificationCount = 5,
  messageCount = 2,
  onSearch,
  onLogout
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const profileRef = useRef(null);
  const searchInputRef = useRef(null);
  const isDark = isDarkMode;

  /* Monitor viewport for small screens (<= 640px) */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      if (!mobile) setIsSearchOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Close profile menu on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Auto-focus search input when expanded on mobile */
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  /* Dynamic style definitions */
  const headerStyle = {
    height: "60px",
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    borderBottom: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
    padding: isMobile ? "0 12px 0 60px" : "0 20px", // Left padding offset on mobile for hamburger button
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
    color: isDark ? "#f8fafc" : "#1e293b",
    boxSizing: "border-box",
  };

  const actionBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: isDark ? "#f8fafc" : "#1e293b",
    borderRadius: "8px",
    padding: 0,
  };

  const badgeStyle = {
    position: "absolute",
    top: "6px",
    right: "6px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "2px 5px",
    minWidth: "14px",
    textAlign: "center",
    lineHeight: 1,
  };

  return (
    <header style={headerStyle}>
      {/* Mobile Search Overlay */}
      {isMobile && isSearchOpen ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            zIndex: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              height: "40px",
              backgroundColor: isDark ? "#1e293b" : "#f8fafc",
              border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
              borderRadius: "8px",
              padding: "0 10px",
            }}
          >
            <span style={{ marginRight: "8px", opacity: 0.6 }}>🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products, orders..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                fontSize: "16px", // 16px font stops mobile browser auto-zoom
                color: isDark ? "#fff" : "#000",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  if (onSearch) onSearch("");
                }}
                style={{ background: "none", border: "none", cursor: "pointer", color: isDark ? "#94a3b8" : "#64748b" }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: isDark ? "#60a5fa" : "#2563eb",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Search Bar */}
          {!isMobile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "320px",
                height: "40px",
                backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                borderRadius: "8px",
                padding: "0 12px",
              }}
            >
              <span style={{ marginRight: "8px", opacity: 0.6 }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products, orders..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "14px",
                  color: isDark ? "#fff" : "#000",
                }}
              />
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {/* Right Actions Menu */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "2px" : "8px" }}>
            {/* Mobile Search Icon Toggle */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                style={actionBtnStyle}
                aria-label="Open Search"
              >
                🔍
              </button>
            )}

            {/* Notification Button */}
            <button type="button" style={actionBtnStyle} aria-label="Notifications">
              🔔
              {notificationCount > 0 && (
                <span style={badgeStyle}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {/* Messages Button */}
            <button type="button" style={actionBtnStyle} aria-label="Messages">
              💬
              {messageCount > 0 && (
                <span style={{ ...badgeStyle, backgroundColor: "#2563eb" }}>
                  {messageCount > 9 ? "9+" : messageCount}
                </span>
              )}
            </button>

            {/* Theme Switcher Toggle */}
            <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
              <ThemeToggle theme={isDark ? "dark" : "light"} toggleTheme={toggleTheme} />
            </div>

            {/* User Profile & Menu Container */}
            <div style={{ position: "relative" }} ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  height: "44px",
                  padding: "0 4px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    minWidth: "32px",
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                {!isMobile && (
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isDark ? "#fff" : "#334155",
                      maxWidth: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.name}
                  </span>
                )}
              </button>

              {/* Profile Dropdown Options */}
              {isProfileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50px",
                    width: "180px",
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    padding: "6px 0",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      borderBottom: `1px solid ${isDark ? "#334155" : "#f1f5f9"}`,
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: isDark ? "#f8fafc" : "#0f172a" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "11px", color: isDark ? "#94a3b8" : "#64748b" }}>
                      Administrator
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>🚪</span> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}