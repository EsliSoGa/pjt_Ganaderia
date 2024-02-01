import './App.css';
//import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
//import { ProtectedRoute } from "./components/ProtectedRouted";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import GanadoScreen from './screens/GanadoScreen';
import ServiciosScreen from './screens/ServicioScreen';
import TrasladosScreen from './screens/TrasladoScreen';
import TempVentaScreen from './screens/TempVentaScreen';
import TempSalidaScreen from './screens/TempSalidaScreen';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<GanadoScreen />}/>
        
        <Route path="/ganado" element={<GanadoScreen />}/>
        <Route path="/servicio/:idS" element={<ServiciosScreen/>}/>
        <Route path="/traslado/:idT" element={<TrasladosScreen/>}/>
        <Route path="/tventa/:idTV" element={<TempVentaScreen/>}/>
        <Route path="/tsalida/:idTS" element={<TempSalidaScreen/>}/>
      </Routes>
    </div>
  );
}

export default App;
