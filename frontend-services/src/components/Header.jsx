import React from "react";
import { Link } from "react-router-dom";

const Header = ({ active, rightElement }) => {
  return (
    <header className="app-header py-3 mb-4">
      <div className="container-fluid d-flex justify-content-between align-items-center px-md-5">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <i className="bi bi-cpu text-primary fs-3"></i>
          <h1 className="h3 mb-0 font-weight-bold text-white" style={{ cursor: "pointer" }}>
            Zero Informática
          </h1>
        </Link>
        
        {rightElement ? (
          rightElement
        ) : (
          <div className="d-flex align-items-center gap-4">
            <Link
              to="/"
              className={`${
                active === "services"
                  ? "text-white text-decoration-none fw-semibold border-bottom border-primary pb-1"
                  : "text-muted text-decoration-none fw-semibold"
              }`}
            >
              <i className={`bi bi-tools ${active === "services" ? "text-primary" : ""}`}></i> Services
            </Link>
            <Link
              to="/clientes"
              className={`${
                active === "clientes"
                  ? "text-white text-decoration-none fw-semibold border-bottom border-primary pb-1"
                  : "text-muted text-decoration-none fw-semibold"
              }`}
            >
              <i className={`bi bi-people ${active === "clientes" ? "text-primary" : ""}`}></i> Clientes
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
