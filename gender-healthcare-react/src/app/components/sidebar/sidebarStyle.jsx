import React from "react";
import { useNavigate } from "react-router-dom";

const sidebarStyle = {
  width: 240,
  minHeight: "100vh",
  background: "#2D3A8C",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "32px 0",
  boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 100,
};

const logoStyle = {
  fontWeight: 700,
  fontSize: 22,
  textAlign: "center",
  marginBottom: 38,
  letterSpacing: 1,
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  paddingLeft: 0,
  margin: 0,
};

const navItemStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px 32px",
  color: active ? "#F9A826" : "#fff",
  background: active ? "rgba(249,168,38,0.12)" : "transparent",
  borderLeft: active ? "4px solid #F9A826" : "4px solid transparent",
  fontWeight: active ? 700 : 500,
  fontSize: 16,
  cursor: "pointer",
  transition: "all .2s",
  textDecoration: "none",
});

const iconStyle = {
  marginRight: 14,
  fontSize: 20,
};

function Sidebar({ active = "users" }) {
  const navigate = useNavigate();
  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>
        <button onClick={() => navigate("/")}>
          <span role="img" aria-label="logo">
            ⚧️
          </span>{" "}
          Gender Healthcare
        </button>
      </div>
      <nav style={navStyle}>
        <a href="/dashboardDoctor" style={navItemStyle(active === "users")}>
          <span style={iconStyle}>👥</span> Quản lý bác sĩ
        </a>
      </nav>
      <div style={{ flex: 1 }} />
    </aside>
  );
}

export default Sidebar;
