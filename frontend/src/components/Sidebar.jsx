import React, { useState, useEffect, useRef } from "react";

/* =========================================================
   HELPER: Build nested tree from flat list
   ========================================================= */
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

/* =========================================================
   ICON COMPONENT
   ========================================================= */
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

/* =========================================================
   SIDEBAR NAV ITEM WITH DRAWER ANIMATION
   ========================================================= */
const SidebarNavItem = ({
  item,
  activePath,
  onNavigate,
  expandedMenus,
  toggleExpand,
  isSidebarCollapsed,
  onOpenSidebar,
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
      // If sidebar is collapsed to icons, expand sidebar first to show the drawer content
      if (isSidebarCollapsed) {
        onOpenSidebar();
      }
      toggleExpand(item.id);
      return;
    }

    if (item.path) {
      onNavigate(item.path);
      return;
    }
    if (item.slug) {
      onNavigate(`/admin/${item.slug}`);
    }
  };

  const handleChildClick = (e, child) => {
    e.preventDefault();
    e.stopPropagation();

    if (child.path) {
      onNavigate(child.path);
      return;
    }
    if (child.slug) {
      onNavigate(`/admin/${child.slug}`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "0.25rem" }}>
      {/* PARENT MENU BUTTON */}
      <button
        type="button"
        onClick={handleParentClick}
        title={isSidebarCollapsed ? item.title : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isSidebarCollapsed ? "center" : "space-between",
          padding: isSidebarCollapsed ? "0.7rem 0" : "0.7rem 1rem",
          borderRadius: "8px",
          border: "none",
          background: isParentActive ? "#0e2a5c" : "transparent",
          color: isParentActive ? "#ffffff" : "#94a3b8",
          fontWeight: isParentActive ? "600" : "400",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", overflow: "hidden" }}>
          <span style={{ color: isParentActive ? "#60a5fa" : "#94a3b8", display: "flex", alignItems: "center" }}>
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
              color: "#64748b",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            expand_more
          </span>
        )}
      </button>

      {/* DRAWER / ACCORDION CHILD ITEMS CONTAINER */}
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
            {/* Vertical Guide Line */}
            <div
              style={{
                position: "absolute",
                left: "1.6rem",
                top: "0.5rem",
                bottom: "0.5rem",
                width: "1px",
                backgroundColor: "#1e3a8a",
              }}
            />

            {item.children.map((child) => {
              const childPath = child.path || (child.slug ? `/admin/${child.slug}` : null);
              const isChildActive = childPath === activePath || child.slug === activePath;

              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={(e) => handleChildClick(e, child)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: isChildActive ? "rgba(37, 99, 235, 0.15)" : "transparent",
                    border: "none",
                    padding: "0.45rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.88rem",
                    color: isChildActive ? "#ffffff" : "#94a3b8",
                    fontWeight: isChildActive ? "600" : "400",
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
                      backgroundColor: isChildActive ? "#60a5fa" : "#64748b",
                      boxShadow: isChildActive ? "0 0 8px #60a5fa" : "none",
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

/* =========================================================
   MAIN SIDEBAR COMPONENT
   ========================================================= */
export default function Sidebar({ navItems = [], loading, activePath, onNavigate }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const structuredItems = buildMenuTree(navItems);

  // Auto-expand parent drawer if active path belongs to a child item
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

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: isCollapsed ? "70px" : "250px",
        background: "#071328",
        padding: isCollapsed ? "1.25rem 0.5rem" : "1.25rem 1rem",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #132a52",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* HEADER & SIDEBAR TOGGLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #132a52",
        }}
      >
        {!isCollapsed && (
          <span style={{ color: "#ffffff", fontWeight: "700", fontSize: "1.05rem", letterSpacing: "0.5px" }}>
            ADMIN PANEL
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          style={{
            background: "#0e2a5c",
            border: "none",
            color: "#94a3b8",
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
      </div>

      {/* NAVIGATION ITEMS */}
      <nav style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {loading ? (
          <div style={{ color: "#64748b", fontSize: "0.85rem", padding: "1rem" }}>Loading...</div>
        ) : structuredItems.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "0.85rem", padding: "1rem" }}>No menu items.</div>
        ) : (
          structuredItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              activePath={activePath}
              onNavigate={onNavigate}
              expandedMenus={expandedMenus}
              toggleExpand={toggleExpand}
              isSidebarCollapsed={isCollapsed}
              onOpenSidebar={() => setIsCollapsed(false)}
            />
          ))
        )}
      </nav>

      {/* USER PROFILE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "0.75rem",
          paddingTop: "1rem",
          marginTop: "auto",
          borderTop: "1px solid #132a52",
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

        {!isCollapsed && (
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#ffffff" }}>Admin User</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              admin@bharatdevices.com
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}