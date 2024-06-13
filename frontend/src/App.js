import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRouted"; // Asegúrate de que ProtectedRoute esté bien implementado

import "bootstrap/dist/css/bootstrap.min.css";
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
import BitacoraScreen from './screens/BitacoraScreen';

function App() {
  const { user: currentUser } = useSelector((state) => state.auth);

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
            <ProtectedRoute isAllowed={!!currentUser}>
              <Profile />
            </ProtectedRoute>
          }
          />
          <Route path="/ganado" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <GanadoScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/servicios" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <ServiciosScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/traslados" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <TrasladosScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/tempventa" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <TempVentaScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/tempsalida" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <TempSalidaScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/tempsalidas" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <TempSalidaTodosScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/tempventatotal" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <TempVentaTotalScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/salidas" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <SalidaScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/ventas" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <VentaScreen />
            </ProtectedRoute>
          }
          />
          <Route path="/bitacora" element={
            <ProtectedRoute isAllowed={!!currentUser}>
              <BitacoraScreen />
            </ProtectedRoute>
          }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
