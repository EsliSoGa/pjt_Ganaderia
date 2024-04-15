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
import TempSalidaTodosScreen from './screens/TempSalidaTodosScreen';
import TempVentaTotalScreen from './screens/TempVentaTotalScreen';
import SalidaScreen from './screens/SalidaScreen';
import VentaScreen from './screens/VentaScreen';
import BitacoraScreen from './screens/BitacoraScreen';

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
        
        <Route path="/aprobarsalida" element={<TempSalidaTodosScreen />}/>
        <Route path="/aprobarventa" element={<TempVentaTotalScreen />}/>

        <Route path="/salida" element={<SalidaScreen />}/>
        <Route path="/venta" element={<VentaScreen />}/>
        
        <Route path="/bitacora" element={<BitacoraScreen />}/>
        
      </Routes>
    </div>
  );
}

export default App;
