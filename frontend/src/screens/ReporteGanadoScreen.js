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

// Opciones predefinidas para el combobox de fincas
const fincaOptions = [
  { value: 'Vilaflor', label: 'Vilaflor' },
  { value: 'Santa Matilde', label: 'Santa Matilde' },
  { value: 'Panorama', label: 'Panorama' },
];

// Componente independiente para el filtro del Reporte 1
const FiltroReporte1 = ({ onFincaChange }) => {
  const [selectedFinca, setSelectedFinca] = useState(null);

  useEffect(() => {
    onFincaChange(selectedFinca);
  }, [selectedFinca]);

  return (
    <Select
      options={fincaOptions}
      value={selectedFinca}
      onChange={setSelectedFinca}
      placeholder="Selecciona una finca"
      className="combobox-finca"
    />
  );
};

// Componente independiente para el filtro del Reporte 2
const FiltroReporte2 = ({ onFincaChange }) => {
  const [selectedFinca, setSelectedFinca] = useState(null);

  useEffect(() => {
    onFincaChange(selectedFinca);
  }, [selectedFinca]);

  return (
    <Select
      options={fincaOptions}
      value={selectedFinca}
      onChange={setSelectedFinca}
      placeholder="Selecciona una finca"
      className="combobox-finca"
    />
  );
};

// Componente independiente para el filtro del Reporte 3
const FiltroReporte3 = ({ onFincaChange }) => {
  const [selectedFinca, setSelectedFinca] = useState(null);

  useEffect(() => {
    onFincaChange(selectedFinca);
  }, [selectedFinca]);

  return (
    <Select
      options={fincaOptions}
      value={selectedFinca}
      onChange={setSelectedFinca}
      placeholder="Selecciona una finca"
      className="combobox-finca"
    />
  );
};

// Filtro independiente para el reporte 4
const FiltroReporte4 = ({ onFincaChange }) => {
  const [selectedFinca, setSelectedFinca] = useState(null);

  useEffect(() => {
    onFincaChange(selectedFinca);
  }, [selectedFinca]);

  return (
    <Select
      options={fincaOptions}
      value={selectedFinca}
      onChange={setSelectedFinca}
      placeholder="Selecciona una finca"
      className="combobox-finca"
    />
  );
};

// Función para formatear la fecha en un formato más legible
const formatFecha = (fechaString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(fechaString).toLocaleDateString(undefined, options);
};

const ReporteGanadoScreen = () => {
  const [reporte1Data, setReporte1Data] = useState([]);
  const [reporte2Data, setReporte2Data] = useState([]);
  const [reporte3Data, setReporte3Data] = useState([]);
  const [reporte4Data, setReporte4Data] = useState([]);

  // Reporte 1: Obtener tipos de animales por finca
  const fetchReporte1 = async (selectedFinca) => {
    if (!selectedFinca) return;
    try {
      const response = await axios.get(`http://localhost:8080/reporte/reporte1`, {
        params: { finca: selectedFinca.value },
      });
      setReporte1Data(response.data);
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

  // Reporte 2: Obtener la estimación de partos por finca
  const fetchReporte2 = async (selectedFinca) => {
    if (!selectedFinca) return;
    try {
      const response = await axios.get(`http://localhost:8080/reporte/reporte2`, {
        params: { finca: selectedFinca.value },
      });
      setReporte2Data(response.data);
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

  // Reporte 3: Obtener los toros de 8.5 meses por finca
  const fetchReporte3 = async (selectedFinca) => {
    if (!selectedFinca) return;
    try {
      const response = await axios.get(`http://localhost:8080/reporte/reporte3`, {
        params: { finca: selectedFinca.value },
      });
      setReporte3Data(response.data);
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

    // Reporte 4: Obtener la cantidad de animales femeninos con 60 meses por finca
    const fetchReporte4 = async (selectedFinca) => {
      if (!selectedFinca) return;
      try {
        const response = await axios.get(`http://localhost:8080/reporte/reporte4`, {
          params: { finca: selectedFinca.value },
        });
        setReporte4Data(response.data);
      } catch (error) {
        console.error('Error fetching report data', error);
      }
    };

  return (
    <div className="reporte-container">
      <h1 className="titulo-pagina">Pantalla de Reportes</h1>
      <div className="reportes-grid">

        {/* Reporte 1: Tipos de animales por finca */}
        <div className="reporte-box">
          <h2>Reporte 1 - Animales por Finca</h2>
          <FiltroReporte1 onFincaChange={fetchReporte1} />

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

        {/* Reporte 2: Tabla de partos estimados */}
        <div className="reporte-box">
          <h2>Reporte 2 - Estimación de Partos</h2>
          <FiltroReporte2 onFincaChange={fetchReporte2} />

          {reporte2Data.length > 0 ? (
            <table className="tabla-partos">
              <thead>
                <tr>
                  <th>Número de Vaca</th>
                  <th>Fecha Estimada de Parto</th>
                  <th>Finca</th>
                </tr>
              </thead>
              <tbody>
                {reporte2Data.map((parto, index) => (
                  <tr key={index}>
                    <td>🐄 {parto.PartosEstimados}</td>
                    <td>📅 {formatFecha(parto.FechaEstimadaParto)}</td>
                    <td>{parto.Finca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay datos para mostrar</p>
          )}
        </div>

        {/* Reporte 3: Cantidad de toros con 38.5 meses */}
        <div className="reporte-box">
          <h2>Reporte 3 - Cantidad de Toros con 38.5 Meses</h2>
          <FiltroReporte3 onFincaChange={fetchReporte3} />

          {reporte3Data.length > 0 ? (
            <table className="tabla-partos">
              <thead>
                <tr>
                  <th>Finca</th>
                  <th>Cantidad de Toros</th>
                </tr>
              </thead>
              <tbody>
                {reporte3Data.map((fila, index) => (
                  <tr key={index}>
                    <td>{fila.Finca}</td>
                    <td>{fila.CantidadAnimales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay toros con 38.5 meses en la finca seleccionada.</p>
          )}
        </div>

         {/* Reporte 4: Cantidad de animales femeninos con 60 meses */}
         <div className="reporte-box">
          <h2>Reporte 4 - Cantidad de Animales Femeninos con 60 Meses</h2>
          <FiltroReporte4 onFincaChange={fetchReporte4} />

          {reporte4Data.length > 0 ? (
            <table className="tabla-partos">
              <thead>
                <tr>
                  <th>Finca</th>
                  <th>Cantidad de Animales Femeninos</th>
                </tr>
              </thead>
              <tbody>
                {reporte4Data.map((fila, index) => (
                  <tr key={index}>
                    <td>{fila.Finca}</td>
                    <td>{fila.CantidadAnimales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay animales femeninos con 60 meses en la finca seleccionada.</p>
          )}
        </div>

        {/* Placeholder para los otros reportes */}
        <div className="reporte-box">
          <h2>Reporte 5</h2>
          <p>Este reporte está en desarrollo.</p>
        </div>
      </div>
    </div>
  );
};

export default ReporteGanadoScreen;
