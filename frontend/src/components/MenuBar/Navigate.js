import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { logout } from "../../actions/auth";
import { clearMessage } from "../../actions/message";
import { useMediaQuery } from 'react-responsive';
import "./Navigation.css";
import logo from "../../images/vaca1.ico";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const logOut = useCallback(() => {
    dispatch(logout()).then(() => {
      navigate("/login");
    });
    if (isMobile) setMenuOpen(false);
  }, [dispatch, isMobile, navigate]);

  let location = useLocation();
  
  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    if (isMobile) setMenuOpen(false);
  };

  const navItemsInicio = [
    { label: "Inicio", path: "/home" }
  ];

  const navItemsAdmin = [
    { label: "Inicio", path: "/profile" },
    { label: "Ganado", path: "/ganado" },
    { label: "Salidas(Generales)", path: "/salida" },
    { label: "Ventas(Generales)", path: "/venta" },
    {
      label: "Aprobaciones",
      submenu: [
        { label: "Salidas temporales", path: "/aprobarsalida" },
        { label: "Ventas temporales", path: "/aprobarventa" }
      ]
    },
    {label: "Herramientas",
      submenu: [
        { label: "Actividades", path: "/actividades" },
        { label: "Reportes", path: "/reporte-ganado" },
        { label: "Bitacora", path: "/bitacora" }
      ]
    }
    //{ label: "Usuarios", path: "/usuario" },
  ];

  const navItemsJefe = [
    { label: "Inicio", path: "/profile" },
    { label: "Ganado", path: "/ganado" },
    { label: "Salidas(Generales)", path: "/salida" },
    { label: "Ventas(Generales)", path: "/venta" },
    {
      label: "Aprobaciones",
      submenu: [
        { label: "Salidas temporales", path: "/aprobarsalida" },
        { label: "Ventas temporales", path: "/aprobarventa" }
      ]
    },
    {label: "Herramientas",
      submenu: [
        { label: "Actividades", path: "/actividades" },
        { label: "Reportes", path: "/reporte-ganado" },
        { label: "Bitacora", path: "/bitacora" }
      ]
    }
  ];

  const navItemsVaquero = [
    { label: "Inicio", path: "/profile" },
    { label: "Ganado", path: "/ganado" },
    { label: "Reportes", path: "/reporte-ganado" },
    { label: "Actividades", path: "/actividades" }
  ];

  const navItemsUsuario = [
    { label: "Inicio", path: "/profile" }
  ];

  const loginItems = [
    { label: "Inicio de sesión", path: "/login" },
    { label: "Registrarse", path: "/register" }
  ];

  const profileItems = [
    { label: "Perfil", path: "/profile" },
    { label: "Editar perfil", path: "/edituser" },
    { label: "Salir", path: "/login", onClick: logOut }
  ];

  const getNavItems = (role) => {
    switch (role) {
      case "Administrador": return navItemsAdmin;
      case "Jefe": return navItemsJefe;
      case "Vaquero": return navItemsVaquero;
      case "Usuario": return navItemsUsuario;
      default: return navItemsInicio;
    }
  };

  const renderNavItems = (items) => {
    return items.map(item => (
      <li key={item.label} className="nav-item">
        <Link to={item.path} onClick={item.onClick || closeMenu}>{item.label}</Link>
        {item.submenu && (
          <ul className="submenu">
            {item.submenu.map(subItem => (
              <li key={subItem.label}>
                <Link to={subItem.path} onClick={closeMenu}>{subItem.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  const navItems = getNavItems(currentUser?.rol);
  const userItems = currentUser ? profileItems : loginItems;

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <Link to="/home" className="brand-logo" onClick={closeMenu}>
          <img src={logo} alt="Logo" className="logo-image" />
          Maragos
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`}>
          {renderNavItems(navItems)}
        </ul>
        <ul className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`}>
          {renderNavItems(userItems)}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
