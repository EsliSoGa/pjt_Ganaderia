import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { logout } from "../../actions/auth";
import { clearMessage } from "../../actions/message";
import "./Navigation.css";

const Navigation = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  let location = useLocation();
  
  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  const navItemsInicio = [
    { label: "Inicio", path: "/home" }
  ];

  const navItemsAdmin = [
    { label: "Inicio", path: "/profile" },
    { label: "Ganado", path: "/ganado" },
    {
      label: "Aprobaciones",
      submenu: [
        { label: "Salidas", path: "/aprobarsalida" },
        { label: "Ventas", path: "/aprobarventa" }
      ]
    },
    { label: "Lista de salidas", path: "/salida" },
    { label: "Lista de ventas", path: "/venta" },
    { label: "Usuarios", path: "/usuario" }
  ];

  const navItemsJefe = [
    { label: "Inicio", path: "/profile" },
    { label: "Ganado", path: "/ganado" },
    {
      label: "Aprobaciones",
      submenu: [
        { label: "Salidas", path: "/aprobarsalida" },
        { label: "Ventas", path: "/aprobarventa" }
      ]
    },
    { label: "Lista de salidas", path: "/salida" },
    { label: "Lista de ventas", path: "/venta" }
  ];

  const navItemsVaquero = [
    { label: "Inicio", path: "/profile" },
    { label: "Ganado", path: "/ganado" },
    { label: "Salidas", path: "/salidas" },
    { label: "Ventas", path: "/ventas" },
    {
      label: "Aprobaciones",
      submenu: [
        { label: "Salidas", path: "/aprobarsalidas" },
        { label: "Ventas", path: "/aprobarventas" }
      ]
    }
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
    { label: "Salir", path: "/profile", onClick: logOut }
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
      <li key={item.label}>
        <Link to={item.path} onClick={item.onClick}>{item.label}</Link>
        {item.submenu && (
          <ul>
            {item.submenu.map(subItem => (
              <li key={subItem.label}>
                <Link to={subItem.path}>{subItem.label}</Link>
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
    <nav>
      <div className="nav-wrapper">
        <Link to="/home" className="brand-logo">Logo</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderNavItems(navItems)}
        </ul>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderNavItems(userItems)}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
