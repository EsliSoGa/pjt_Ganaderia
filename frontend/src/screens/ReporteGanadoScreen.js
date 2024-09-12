import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Select from 'react-select'; // Para el combobox
import './ReporteGanadoScreen.css';

// Definir los colores para cada tipo de animal
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Definir los íconos y etiquetas según el tipo de animal
const ICONS_MAP = {
  Toro: { color: '#0088FE', icon: '🐂' },
  Vaca: { color: '#00C49F', icon: '🐄' },
  Ternero: { color: '#FFBB28', icon: '🐃' },
};

const ReporteGanadoScreen = () => {
  const [reporte1Data, setReporte1Data] = useState([]);
  const [selectedFinca, setSelectedFinca] = useState(null); // Opción seleccionada en el combobox

  // Opciones predefinidas para el combobox de fincas
  const fincaOptions = [
    { value: 'Vilaflor', label: 'Vilaflor' },
    { value: 'Santa Matilde', label: 'Santa Matilde' },
    { value: 'Panorama', label: 'Panorama' },
  ];

  const fetchReporte1 = async () => {
    try {
      if (!selectedFinca) return;

      const response = await axios.get(`http://localhost:8080/reporte/reporte1`, {
        params: { finca: selectedFinca.value },
      });
      setReporte1Data(response.data);
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

  useEffect(() => {
    if (selectedFinca) {
      fetchReporte1();
    }
  }, [selectedFinca]);

  return (
    <div className="reporte-container">
      <h1 className="titulo-pagina">Pantalla de Reportes</h1>
      <div className="reportes-grid">
        {/* Reporte 1: Tipos de animales por finca */}
        <div className="reporte-box">
          <h2>Reporte 1 - Animales por Finca</h2>
          
          <Select
            options={fincaOptions} // Opciones de fincas predefinidas
            value={selectedFinca} // Valor seleccionado
            onChange={setSelectedFinca} // Cambiar finca seleccionada
            placeholder="Selecciona una finca"
            className="combobox-finca" // Estilo personalizado para el combobox
          />

          {reporte1Data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reporte1Data}
                  dataKey="cantidad"
                  nameKey="Tipo"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {reporte1Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span>
                      {ICONS_MAP[value]?.icon} {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos para mostrar</p>
          )}
        </div>

        {/* Espacio para los otros reportes, placeholders */}
        <div className="reporte-box">
          <h2>Reporte 2</h2>
          <p>Este reporte está en desarrollo.</p>
        </div>
        <div className="reporte-box">
          <h2>Reporte 3</h2>
          <p>Este reporte está en desarrollo.</p>
        </div>
        <div className="reporte-box">
          <h2>Reporte 4</h2>
          <p>Este reporte está en desarrollo.</p>
        </div>
        <div className="reporte-box">
          <h2>Reporte 5</h2>
          <p>Este reporte está en desarrollo.</p>
        </div>
      </div>
    </div>
  );
};

export default ReporteGanadoScreen;
