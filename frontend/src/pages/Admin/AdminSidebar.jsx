import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../components/ThemeContext";

const buildMenuTree = (items = []) => {
  if (!Array.isArray(items)) return [];
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item.id] = {
      ...item,
      children: Array.isArray(item.children) && item.children.length > 0 ? [...item.children] : [],
    };
  });

  items.forEach((item) => {
    if (item.parentId !== null && item.parentId !== undefined && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  const sortByOrder = (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0);
  roots.sort(sortByOrder);
  roots.forEach((root) => root.children.sort(sortByOrder));

  return roots;
};

const MenuIcon = ({ icon }) => (
  <span
    className="material-icons"
    style={{
      fontSize: "20px",
      width: "24px",
      minWidth: "24px",
      height: "24px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      userSelect: "none",
    }}
  >
    {icon || "folder"}
  </span>
);

const SidebarNavItem = ({
  item,
  activePath,
  onNavigate,
  expandedMenus,
  toggleExpand,
  isSidebarCollapsed,
  onOpenSidebar,
  isDark,
  onCloseMobile
}) => {
  const contentRef = useRef(null);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isExpanded = Boolean(expandedMenus[item.id]);

  const isCurrentItem = item.path === activePath || item.slug === activePath;
  const isChildActive =
    hasChildren &&
    item.children.some(
      (child) => child.path === activePath || child.slug === activePath
    );
  const isParentActive = isCurrentItem || isChildActive;

  const handleParentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasChildren) {
      if (isSidebarCollapsed) {
        onOpenSidebar();
      }
      toggleExpand(item.id);
      return;
    }

    if (item.path) {
      onNavigate(item.path);
    } else if (item.slug) {
      onNavigate(`/admin/${item.slug}`);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleChildClick = (e, child) => {
    e.preventDefault();
    e.stopPropagation();

    if (child.path) {
      onNavigate(child.path);
    } else if (child.slug) {
      onNavigate(`/admin/${child.slug}`);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const activeBg = isDark ? "#0e2a5c" : "#e0e7ff";
  const activeText = isDark ? "#ffffff" : "#1e40af";
  const inactiveText = isDark ? "#94a3b8" : "#475569";
  const activeIconColor = isDark ? "#60a5fa" : "#2563eb";

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "0.25rem" }}>
      <button
        type="button"
        onClick={handleParentClick}
        title={isSidebarCollapsed ? item.title : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isSidebarCollapsed ? "center" : "space-between",
          padding: isSidebarCollapsed ? "0.75rem 0" : "0.75rem 1rem",
          minHeight: "44px",
          borderRadius: "8px",
          border: "none",
          background: isParentActive ? activeBg : "transparent",
          color: isParentActive ? activeText : inactiveText,
          fontWeight: isParentActive ? "600" : "400",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", overflow: "hidden" }}>
          <span style={{ color: isParentActive ? activeIconColor : inactiveText, display: "flex", alignItems: "center" }}>
            <MenuIcon icon={item.icon} />
          </span>

          {!isSidebarCollapsed && (
            <span
              style={{
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.title}
            </span>
          )}
        </div>

        {hasChildren && !isSidebarCollapsed && (
          <span
            className="material-icons"
            style={{
              fontSize: "18px",
              color: inactiveText,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            expand_more
          </span>
        )}
      </button>

      {hasChildren && (
        <div
          style={{
            maxHeight: isExpanded && !isSidebarCollapsed ? `${contentRef.current?.scrollHeight || 300}px` : "0px",
            opacity: isExpanded && !isSidebarCollapsed ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-in-out",
          }}
        >
          <div
            ref={contentRef}
            style={{
              position: "relative",
              paddingLeft: "2.1rem",
              paddingTop: "0.35rem",
              paddingBottom: "0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "1.6rem",
                top: "0.5rem",
                bottom: "0.5rem",
                width: "1px",
                backgroundColor: isDark ? "#1e3a8a" : "#cbd5e1",
              }}
            />

            {item.children.map((child) => {
              const childPath = child.path || (child.slug ? `/admin/${child.slug}` : null);
              const isChildItemActive = childPath === activePath || child.slug === activePath;

              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={(e) => handleChildClick(e, child)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    minHeight: "40px",
                    background: isChildItemActive
                      ? isDark ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.1)"
                      : "transparent",
                    border: "none",
                    padding: "0.5rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.88rem",
                    color: isChildItemActive
                      ? isDark ? "#ffffff" : "#1d4ed8"
                      : isDark ? "#94a3b8" : "#64748b",
                    fontWeight: isChildItemActive ? "600" : "400",
                    cursor: "pointer",
                    textAlign: "left",
                    zIndex: 1,
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      minWidth: "6px",
                      borderRadius: "50%",
                      backgroundColor: isChildItemActive ? "#3b82f6" : isDark ? "#64748b" : "#cbd5e1",
                      boxShadow: isChildItemActive ? "0 0 8px #3b82f6" : "none",
                      transition: "all 0.2s",
                    }}
                  />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {child.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ navItems = [], loading, activePath, onNavigate }) {
  const { isDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const structuredItems = buildMenuTree(navItems);

  /* Responsive screen watcher */
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      if (!mobileView) setIsMobileOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    structuredItems.forEach((item) => {
      if (
        Array.isArray(item.children) &&
        item.children.some((child) => child.path === activePath || child.slug === activePath)
      ) {
        setExpandedMenus((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [activePath, navItems]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleExpand = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const sidebarBg = isDarkMode ? "#071328" : "#ffffff";
  const borderColor = isDarkMode ? "#132a52" : "#e2e8f0";
  const titleColor = isDarkMode ? "#ffffff" : "#0f172a";
  const subTextColor = isDarkMode ? "#64748b" : "#94a3b8";

  return (
    <>
      {/* Mobile Floating Hamburger Trigger Button */}
      {isMobile && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open Navigation"
          style={{
            position: "fixed",
            top: "12px",
            left: "12px",
            zIndex: 99,
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            background: sidebarBg,
            color: titleColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          <span className="material-icons">menu</span>
        </button>
      )}

      {/* Mobile Dark Overlay Backdrop */}
      {isMobile && isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 998,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Main Drawer Shell */}
      <aside
        className="admin-sidebar"
        style={{
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 999,
          width: isMobile ? "280px" : isCollapsed ? "70px" : "250px",
          transform: isMobile && !isMobileOpen ? "translateX(-100%)" : "translateX(0)",
          background: sidebarBg,
          padding: (isCollapsed && !isMobile) ? "1.25rem 0.5rem" : "1.25rem 1rem",
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${borderColor}`,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease, background 0.3s ease",
          overflow: "hidden",
          whiteSpace: "nowrap",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER & TOGGLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: (isCollapsed && !isMobile) ? "center" : "space-between",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          {(!isCollapsed || isMobile) && (
            <span style={{ color: titleColor, fontWeight: "700", fontSize: "1.05rem", letterSpacing: "0.5px" }}>
              ADMIN PANEL
            </span>
          )}

          {isMobile ? (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close Navigation"
              style={{
                background: isDarkMode ? "#0e2a5c" : "#f1f5f9",
                border: "none",
                color: isDarkMode ? "#94a3b8" : "#475569",
                borderRadius: "6px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <span className="material-icons" style={{ fontSize: "20px" }}>close</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              style={{
                background: isDarkMode ? "#0e2a5c" : "#f1f5f9",
                border: "none",
                color: isDarkMode ? "#94a3b8" : "#475569",
                borderRadius: "6px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <span className="material-icons" style={{ fontSize: "20px" }}>
                {isCollapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          )}
        </div>

        {/* NAV ITEMS */}
        <nav style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {loading ? (
            <div style={{ color: subTextColor, fontSize: "0.85rem", padding: "1rem" }}>Loading...</div>
          ) : structuredItems.length === 0 ? (
            <div style={{ color: subTextColor, fontSize: "0.85rem", padding: "1rem" }}>No menu items.</div>
          ) : (
            structuredItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                activePath={activePath}
                onNavigate={onNavigate}
                expandedMenus={expandedMenus}
                toggleExpand={toggleExpand}
                isSidebarCollapsed={isMobile ? false : isCollapsed}
                onOpenSidebar={() => setIsCollapsed(false)}
                isDark={isDarkMode}
                onCloseMobile={isMobile ? () => setIsMobileOpen(false) : null}
              />
            ))
          )}
        </nav>

        {/* USER PROFILE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: (isCollapsed && !isMobile) ? "center" : "flex-start",
            gap: "0.75rem",
            paddingTop: "1rem",
            marginTop: "auto",
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "600",
              minWidth: "36px",
            }}
          >
            A
          </div>

          {(!isCollapsed || isMobile) && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "600", color: titleColor }}>Admin User</div>
              <div style={{ fontSize: "0.72rem", color: subTextColor, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                admin@bharatdevices.com
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}