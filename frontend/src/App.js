import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRouted";

import "./App.css";
import 'primereact/resources/primereact.min.css';
import Navigation from "./components/MenuBar/Navigate";

import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import GanadoScreen from './screens/GanadoScreen';
import ServiciosScreen from './screens/ServicioScreen';
import TrasladosScreen from './screens/TrasladoScreen';
import TempVentaScreen from './screens/TempVentaScreen';
import TempSalidaScreen from './screens/TempSalidaScreen';
import TempSalidaTodosScreen from './screens/TempSalidaTodosScreen';
import TempVentaTotalScreen from './screens/TempVentaTotalScreen';
import SalidaScreen from './screens/SalidaScreen';
import VentaScreen from './screens/VentaScreen';
import ActividadesScreen from "./screens/ActividadesScreen";
import BitacoraScreen from './screens/BitacoraScreen';
import LecheScreen from './screens/LecheScreen'; // Nueva importación
import VacunasScreen from './screens/VacunasScreen'; // Nueva importación
import ReporteGanadoScreen from './screens/ReporteGanadoScreen';
import UsuariosScreen from "./screens/UsuarioScreen";

function App() {
  const { user: currentUser } = useSelector((state) => state.auth);
  useEffect(() => {
    if (currentUser) {

    } else {

    }
  }, [currentUser]);
  return (
    <div className="App">
      <Navigation />
      <div className="container mt-3">
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route element={<ProtectedRoute isAllowed={!currentUser} />} >
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/profile" element={
            <ProtectedRoute
              isAllowed={!!currentUser}
            >
              <Profile />
            </ProtectedRoute>
          }
          />
          <Route path="/ganado" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <GanadoScreen />
            </ProtectedRoute>
          } />
          <Route path="/servicio/:idS" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <ServiciosScreen />
            </ProtectedRoute>
          } />
          <Route path="/traslado/:idT" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <TrasladosScreen />
            </ProtectedRoute>
          } />
          <Route path="/tventa/:idTV" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <TempVentaScreen />
            </ProtectedRoute>
          } />
          <Route path="/reporte-ganado" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <ReporteGanadoScreen />
            </ProtectedRoute>
          } />
          <Route path="/actividades" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <ActividadesScreen />
            </ProtectedRoute>
          } />
          <Route path="/tsalida/:idTS" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <TempSalidaScreen />
            </ProtectedRoute>
          } />

          <Route path="/aprobarsalida" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe")}
            >
              <TempSalidaTodosScreen />
            </ProtectedRoute>
          } />
          <Route path="/aprobarventa" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe")}
            >
              <TempVentaTotalScreen />
            </ProtectedRoute>
          } />

          <Route path="/salida" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe")}
            >
              <SalidaScreen />
            </ProtectedRoute>
          } />
          <Route path="/venta" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe")}
            >
              <VentaScreen />
            </ProtectedRoute>
          } />

          <Route path="/bitacora" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe")}
            >
              <BitacoraScreen />
            </ProtectedRoute>
          } />
          <Route path="/leche" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <LecheScreen />
            </ProtectedRoute>
          } />
          <Route path="/vacunas" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador" || currentUser.rol === "Jefe" || currentUser.rol === "Vaquero")}
            >
              <VacunasScreen />
            </ProtectedRoute>
          } />
          <Route path="/usuario" element={
            <ProtectedRoute
              isAllowed={!!currentUser && (currentUser.rol === "Administrador")}
            >
              <UsuariosScreen />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
