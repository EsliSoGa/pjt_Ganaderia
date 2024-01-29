import './App.css';
//import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
//import { ProtectedRoute } from "./components/ProtectedRouted";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import GanadoScreen from './screens/GanadoScreen';
import ServiciosScreen from './screens/ServicioScreen';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<GanadoScreen />}/>
        
        <Route path="/ganado" element={<GanadoScreen />}/>
        <Route path="/servicio/:idS" element={<ServiciosScreen/>}/>
      </Routes>
    </div>
  );
}

export default App;
