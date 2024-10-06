import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, BarChart, Bar, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from 'react-select'; // Para el combobox
import './ReporteGanadoScreen.css';

// Definir los colores para cada tipo de animal
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Definir los íconos y etiquetas según el tipo de animal
const ICONS_MAP = {
  Toro: { color: '#0088FE', icon: '🐂' },  // Azul para Toro
  Vaca: { color: '#00C49F', icon: '🐄' },  // Verde para Vaca
  Ternero: { color: '#FFD700', icon: '🐃' },  // Amarillo dorado para Ternero
  Novilla: { color: '#FF6347', icon: '🐄' },  // Rojo anaranjado para Novilla (mismo ícono que Vaca)
  Torete: { color: '#FF4500', icon: '🐂' },  // Rojo fuego para Torete (similar ícono que Toro)
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

// Reporte 5: Función para obtener la ficha del ganado
const FiltroReporte5 = ({ onNumeroChange }) => {
  const [numeroGanado, setNumeroGanado] = useState('');

  const handleInputChange = (e) => {
    setNumeroGanado(e.target.value);
  };

  const buscarGanado = () => {
    onNumeroChange(numeroGanado);
  };

  return (
    <div className="filtro-busqueda-ganado">
      <input
        type="text"
        value={numeroGanado}
        onChange={handleInputChange}
        placeholder="Ingrese el número del ganado"
        className="input-numero"
      />
      <button onClick={buscarGanado} className="buscar-btn">Buscar</button>
    </div>
  );
};

// Componente independiente para el filtro del Reporte 6
const FiltroReporte6 = ({ onNumeroChange }) => {
  const [numeroGanado, setNumeroGanado] = useState('');

  const handleInputChange = (e) => {
    setNumeroGanado(e.target.value);
  };

  const buscarGanado = () => {
    onNumeroChange(numeroGanado);
  };

  return (
    <div className="filtro-busqueda-ganado">
      <input
        type="text"
        value={numeroGanado}
        onChange={handleInputChange}
        placeholder="Ingrese el número del ganado"
        className="input-numero"
      />
      <button onClick={buscarGanado} className="buscar-btn">Buscar</button>
    </div>
  );
};

const ReporteGanadoScreen = () => {
  const [reporte1Data, setReporte1Data] = useState([]);
  const [reporte2Data, setReporte2Data] = useState([]);
  const [reporte3Data, setReporte3Data] = useState([]);
  const [reporte4Data, setReporte4Data] = useState([]);
  const [reporte5Data, setReporte5Data] = useState(null);
  const [reporte6Data, setReporte6Data] = useState([]);

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

  function formatFecha(fecha) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  }


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

  // Reporte 5: Obtener la ficha del ganado por número
  const fetchReporte5 = async (numeroGanado) => {
    if (!numeroGanado) return;
    try {
      const response = await axios.get(`http://localhost:8080/reporte/reporte5`, {
        params: { numero: numeroGanado },
      });
      setReporte5Data(response.data);
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

  // Reporte 6: Obtener el ganado junto con la producción de leche por número
  const fetchReporte6 = async (numeroGanado) => {
    if (!numeroGanado) return;
    try {
      const response = await axios.get(`http://localhost:8080/reporte/reporte6`, {
        params: { numero: numeroGanado },
      });
      setReporte6Data(response.data);
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

  const [isGraphView, setIsGraphView] = useState(true); // Estado para alternar entre gráfica y tabla

  const toggleView = () => {
    setIsGraphView(!isGraphView); // Cambia entre gráfica y tabla
  };

  // Calcular la producción media diaria
  function calcularProduccionMediaDiaria(produccionSemanal) {
    return (produccionSemanal / 7).toFixed(2);
  }

  // Calcular la producción acumulada mensual (ejemplo básico)
  function calcularProduccionAcumuladaMensual() {
    // Aquí puedes agregar la lógica real para calcular la producción mensual acumulada
    return 1200; // Ejemplo estático
  }

  // Formatear datos para la gráfica de tendencia
  function formatearDatosGrafica(data) {
    return data.map(item => ({
      Fecha: formatFecha(item.FechaProduccion),
      Produccion_diaria: item.Produccion_diaria
    }));
  }

  // Analizar cambios en la producción para generar alertas
  function analizarCambiosProduccion(produccionSemanal) {
    const mediaDiaria = calcularProduccionMediaDiaria(produccionSemanal);
    if (mediaDiaria < 15) {
      return <p className="alerta-alerta">Alerta: Producción significativamente baja</p>;
    } else if (mediaDiaria > 25) {
      return <p className="alerta-alerta">Alerta: Producción significativamente alta</p>;
    } else {
      return <p>Producción dentro del rango esperado.</p>;
    }
  }

  return (
    <div className="reporte-container">
      {/* Barra de título */}
      <header className="reporte-header">
        <h1>Reportes VPSM</h1>
      </header>

      {/* Grid de reportes */}
      <div className="reportes-grid">

        {/* Reporte 1: Tipos de animales por finca */}
        <div className="reporte-box scrollable-box">
          <h2>Reporte 1 - Animales por Finca</h2>

          {/* Contenedor para el dropdown y el botón */}
          <div className="toggle-container">
            <FiltroReporte1 onFincaChange={fetchReporte1} /> {/* Dropdown */}
            <button className="toggle-button" onClick={toggleView}>
              {isGraphView ? "Ver como Tabla" : "Ver como Gráfica"}
            </button>
          </div>

          {/* Vista condicional: gráfica o tabla */}
          {isGraphView ? (
            reporte1Data.length > 0 ? (
              <ResponsiveContainer className="responsive-graph" width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reporte1Data}
                    dataKey="cantidad"
                    nameKey="Tipo"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    label={({ name, cantidad }) => `${name}: ${cantidad}`} /* Etiqueta que muestra el nombre y la cantidad */
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
            )
          ) : (
            // Vista de tabla
            <table className="reporte-tabla">
              <thead>
                <tr>
                  <th>Tipo de Animal</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {reporte1Data.length > 0 ? (
                  reporte1Data.map((animal, index) => (
                    <tr key={index}>
                      <td>{animal.Tipo}</td>
                      <td>{animal.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No hay datos para mostrar</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Nueva sección: Gráfica de barras para mostrar la cantidad de animales por finca */}
          <h3>Distribución de Animales por Finca</h3>
          {reporte1Data.length > 0 ? (
            <ResponsiveContainer className="responsive-graph" width="100%" height={300}>
              <BarChart data={reporte1Data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Tipo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos para mostrar</p>
          )}
        </div>


        {/* Reporte 2: Estimación de partos (fichas de animales) */}
        <div className="reporte-box scrollable-box">
          <h2>Reporte 2 - Estimación de Partos</h2>
          <FiltroReporte2 onFincaChange={fetchReporte2} />

          {reporte2Data && reporte2Data.length > 0 && (
            <div>
              <strong>Partos Pendientes:</strong> {reporte2Data.length}
            </div>
          )}

          {reporte2Data.length > 0 ? (
            <div className="ficha-animal-container">
              {reporte2Data.map((parto, index) => (
                <div key={index} className="ficha-animal presentable-ficha">
                  <h3>Información del Animal {parto.NombreAnimal}</h3>
                  <p><strong>Número:</strong> {parto.NumeroAnimal}</p>
                  <p><strong>Finca:</strong> {parto.Finca}</p>

                  <h4>Información de los Padres</h4>
                  <p><strong>Padre:</strong> {parto.NombrePadre || 'No disponible'}</p>
                  <p><strong>Madre:</strong> {parto.NombreMadre || 'No disponible'}</p>

                  <h4>Parto Estimado</h4>
                  <p><strong>Fecha Estimada de Parto:</strong> {parto.FechaEstimadaParto ? formatFecha(parto.FechaEstimadaParto) : 'No disponible'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay datos para mostrar</p>
          )}
        </div>

        {/* Reporte 3: Cantidad de toros con 38.5 meses (tabla) */}
        <div className="reporte-box scrollable-box table-container">
          <h2>Reporte 3 - Listado de Toretes</h2>
          <FiltroReporte3 onFincaChange={fetchReporte3} />

          {reporte3Data.length > 0 ? (
            <table className="tabla-partos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Número</th>
                  <th>Sexo</th>
                  <th>Color</th>
                  <th>Peso</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Finca</th>
                </tr>
              </thead>
              <tbody>
                {reporte3Data.map((animal, index) => (
                  <tr key={index}>
                    <td>{animal.Nombre}</td>
                    <td>{animal.Numero}</td>
                    <td>{animal.Sexo}</td>
                    <td>{animal.Color}</td>
                    <td>{animal.Peso} kg</td>
                    <td>{new Date(animal.FechaNacimiento).toLocaleDateString()}</td>
                    <td>{animal.Finca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay Toretes en la finca seleccionada.</p>
          )}
        </div>


        {/* Reporte 4: Cantidad de animales femeninos con 60 meses (tabla) */}
        <div className="reporte-box scrollable-box table-container">
          <h2>Reporte 4 - Listado de Novillas</h2>
          <FiltroReporte4 onFincaChange={fetchReporte4} />

          {reporte4Data.length > 0 ? (
            <table className="tabla-partos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Número</th>
                  <th>Sexo</th>
                  <th>Color</th>
                  <th>Peso</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Finca</th>
                </tr>
              </thead>
              <tbody>
                {reporte4Data.map((animal, index) => (
                  <tr key={index}>
                    <td>{animal.Nombre}</td>
                    <td>{animal.Numero}</td>
                    <td>{animal.Sexo}</td>
                    <td>{animal.Color}</td>
                    <td>{animal.Peso} kg</td>
                    <td>{new Date(animal.FechaNacimiento).toLocaleDateString()}</td>
                    <td>{animal.Finca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay Novillas en la finca seleccionada.</p>
          )}
        </div>

        {/* Reporte 5: Ficha del ganado */}
        <div className="reporte-box scrollable-box">
          <h2>Reporte 5 - Ficha del Ganado</h2>
          <FiltroReporte5 onNumeroChange={fetchReporte5} />

          {reporte5Data ? (
            <div className="ficha-ganado presentable-ficha">
              {/* Información del animal */}
              <div className="info-section">
                <h3>Ficha de {reporte5Data.Nombre}</h3>
                <div className="ganado-img-container">
                  <img src={`http://localhost:8080/${reporte5Data.Imagen}`} alt="Ganado" />
                </div>
                <p><strong>Número:</strong> {reporte5Data.Numero}</p>
                <p><strong>Sexo:</strong> {reporte5Data.Sexo}</p>
                <p><strong>Color:</strong> {reporte5Data.Color}</p>
                <p><strong>Peso:</strong> {reporte5Data.Peso} kg</p>
                <p><strong>Fecha de Nacimiento:</strong> {formatFecha(reporte5Data.Fecha)}</p>
                <p><strong>Tipo:</strong> {reporte5Data.Tipo}</p>
                <p><strong>Finca:</strong> {reporte5Data.Finca}</p>
              </div>

              {/* Información de los padres */}
              <div className="info-section">
                <h4>Información de los Padres</h4>
                <p><strong>Padre:</strong> {reporte5Data.NombrePadre || 'No disponible'}</p>
                <p><strong>Madre:</strong> {reporte5Data.NombreMadre || 'No disponible'}</p>
              </div>

              {/* Producción de Leche */}
              <div className="info-section section-highlight">
                <h4>Registro de Producción de Leche</h4>
                {reporte5Data.FechaLeche ? (
                  <p><strong>Última Fecha de Producción:</strong> {formatFecha(reporte5Data.FechaLeche)}</p>
                ) : (
                  <p>No hay datos de producción de leche.</p>
                )}
                <p><strong>Producción Diaria:</strong> {reporte5Data.ProduccionLeche || 'No disponible'} litros</p>
              </div>

              {/* Registro de Vacunación */}
              <div className="info-section section-highlight">
                <h4>Registro de Vacunación</h4>
                {reporte5Data.FechaVacunacion ? (
                  <>
                    <p><strong>Última Vacunación:</strong> {formatFecha(reporte5Data.FechaVacunacion)}</p>
                    <p><strong>Tipo de Vacuna:</strong> {reporte5Data.TipoVacuna}</p>
                    <p><strong>Dosis:</strong> {reporte5Data.DosisVacuna} ml</p>
                    <p><strong>Próxima Vacunación:</strong> {formatFecha(reporte5Data.ProximaVacuna) || 'No disponible'}</p>
                  </>
                ) : (
                  <p>No hay registros de vacunación.</p>
                )}
              </div>

              {/* Historial de Traslados */}
              <div className="info-section">
                <h4>Historial de Traslados</h4>
                {reporte5Data.FechaTraslado ? (
                  <>
                    <p><strong>Finca de Origen:</strong> {reporte5Data.FincaOrigen}</p>
                    <p><strong>Finca de Destino:</strong> {reporte5Data.FincaDestino}</p>
                    <p><strong>Fecha de Traslado:</strong> {formatFecha(reporte5Data.FechaTraslado)}</p>
                  </>
                ) : (
                  <p>No hay traslados registrados.</p>
                )}
              </div>

              {/* Servicios y Parto Estimado */}
              <div className="info-section">
                <h4>Servicios y Parto Estimado</h4>
                {reporte5Data.FechaServicio ? (
                  <>
                    <p><strong>Fecha del Último Servicio:</strong> {formatFecha(reporte5Data.FechaServicio)}</p>
                    <p><strong>Condición:</strong> {reporte5Data.CondicionServicio}</p>
                    <p><strong>Edad del Servicio:</strong> {reporte5Data.EdadServicio} meses</p>
                    <p><strong>Fecha Estimada de Parto:</strong> {formatFecha(reporte5Data.FechaEstimadaParto)}</p>
                  </>
                ) : (
                  <p>No hay registros de servicios.</p>
                )}
              </div>

              {/* Registro de Salidas */}
              <div className="info-section">
                <h4>Registro de Salidas</h4>
                {reporte5Data.FechaSalida ? (
                  <>
                    <p><strong>Fecha de Salida:</strong> {formatFecha(reporte5Data.FechaSalida)}</p>
                    <p><strong>Motivo:</strong> {reporte5Data.MotivoSalida}</p>
                    <p><strong>Comentarios:</strong> {reporte5Data.ComentariosSalida}</p>
                  </>
                ) : (
                  <p>No hay registros de salida.</p>
                )}
              </div>

              {/* Historial de Ventas */}
              <div className="info-section section-highlight">
                <h4>Historial de Ventas</h4>
                {reporte5Data.FechaVenta ? (
                  <>
                    <p><strong>Fecha de Venta:</strong> {formatFecha(reporte5Data.FechaVenta)}</p>
                    <p><strong>Comprador:</strong> {reporte5Data.CompradorVenta}</p>
                    <p><strong>Precio:</strong> ${reporte5Data.PrecioVenta}</p>
                    <p><strong>Total:</strong> ${reporte5Data.TotalVenta}</p>
                  </>
                ) : (
                  <p>No hay registros de ventas.</p>
                )}
              </div>

            </div>
          ) : (
            <p>No se ha encontrado información para el número ingresado.</p>
          )}
        </div>

        {/* Reporte 6: Información del Ganado */}
        <div className="reporte-box scrollable-box">
          <h2>Reporte 6- Leche Ganado Individual</h2>
          <FiltroReporte6 onNumeroChange={fetchReporte6} />

          {reporte6Data.length > 0 ? (
            <div className="presentable-ficha ficha-ganado">
              {/* Contenedor de la imagen del ganado */}
              <div className="ganado-img-container">
                <img src={`http://localhost:8080/${reporte6Data[0].Imagen}`} alt="Imagen del ganado" />
              </div>

              {/* Información del ganado */}
              <div className="info-section">
                <section>
                  <h3>{reporte6Data[0].Nombre}</h3>
                  <p><strong>Número:</strong> {reporte6Data[0].Numero}</p>
                  <p><strong>Sexo:</strong> {reporte6Data[0].Sexo}</p>
                  <p><strong>Color:</strong> {reporte6Data[0].Color}</p>
                  <p><strong>Peso:</strong> {reporte6Data[0].Peso} kg</p>
                  <p><strong>Fecha de Nacimiento:</strong> {formatFecha(reporte6Data[0].FechaNacimiento)}</p>
                  <p><strong>Finca:</strong> {reporte6Data[0].Finca}</p>
                  <p><strong>Tipo:</strong> {reporte6Data[0].Tipo}</p>
                </section>
              </div>

              {/* Producción de leche */}
              <div className="info-section section-highlight">
                <h4>Producción de Leche</h4>
                {reporte6Data[0].FechaProduccion ? (
                  <>
                    <p><strong>Última Fecha de Producción:</strong> {formatFecha(reporte6Data[0].FechaProduccion)}</p>
                    <p><strong>Producción Semanal:</strong> {reporte6Data[0].Produccion_diaria} litros</p>
                    <p><strong>Producción Media Diaria:</strong> {calcularProduccionMediaDiaria(reporte6Data[0].Produccion_diaria)} litros</p>
                    <p><strong>Producción Acumulada Mensual:</strong> {calcularProduccionAcumuladaMensual()} litros</p>
                  </>
                ) : (
                  <p>No hay datos de producción de leche.</p>
                )}
              </div>

              {/* Gráfica de tendencia de producción semanal */}
              <div className="info-section section-highlight">
                <h4>Tendencia de Producción Semanal</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatearDatosGrafica(reporte6Data)}>
                    <Line type="monotone" dataKey="Produccion_diaria" stroke="#8884d8" name="Producción Semanal" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="Fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Alertas de producción */}
              <div className="info-section alertas">
                <h4>Alertas de Producción</h4>
                {analizarCambiosProduccion(reporte6Data[0].Produccion_diaria)}
              </div>
            </div>
          ) : (
            <p>No se ha encontrado información para el número ingresado.</p>
          )}
        </div>


        {/* Nuevo Reporte 7 que abarca las tres columnas */}
        {/* Reporte 7 (Nuevo espacio que abarca toda la tercera fila con contenido del Reporte 5) */}
        <div className="reporte-box-large">
          <h2>Ficha del Ganado</h2>

          {reporte5Data ? (
            <div className="ficha-ganado-horizontal">
              {/* Información del animal */}
              <div className="info-section-horizontal">
                <h3>Ficha de {reporte5Data.Nombre}</h3>
                <div className="ganado-img-container">
                  <img src={`http://localhost:8080/${reporte5Data.Imagen}`} alt="Ganado" />
                </div>
                <p><strong>Número:</strong> {reporte5Data.Numero}</p>
                <p><strong>Sexo:</strong> {reporte5Data.Sexo}</p>
                <p><strong>Color:</strong> {reporte5Data.Color}</p>
                <p><strong>Peso:</strong> {reporte5Data.Peso} kg</p>
                <p><strong>Fecha de Nacimiento:</strong> {formatFecha(reporte5Data.Fecha)}</p>
                <p><strong>Tipo:</strong> {reporte5Data.Tipo}</p>
                <p><strong>Finca:</strong> {reporte5Data.Finca}</p>
              </div>

              {/* Información de los padres */}
              <div className="info-section-horizontal">
                <h4>Información de los Padres</h4>
                <p><strong>Padre:</strong> {reporte5Data.NombrePadre || 'No disponible'}</p>
                <p><strong>Madre:</strong> {reporte5Data.NombreMadre || 'No disponible'}</p>
              </div>

              {/* Producción de Leche */}
              <div className="info-section-horizontal section-highlight">
                <h4>Registro de Producción de Leche</h4>
                {reporte5Data.FechaLeche ? (
                  <p><strong>Última Fecha de Producción:</strong> {formatFecha(reporte5Data.FechaLeche)}</p>
                ) : (
                  <p>No hay datos de producción de leche.</p>
                )}
                <p><strong>Producción Diaria:</strong> {reporte5Data.ProduccionLeche || 'No disponible'} litros</p>
              </div>

              {/* Registro de Vacunación */}
              <div className="info-section-horizontal section-highlight">
                <h4>Registro de Vacunación</h4>
                {reporte5Data.FechaVacunacion ? (
                  <>
                    <p><strong>Última Vacunación:</strong> {formatFecha(reporte5Data.FechaVacunacion)}</p>
                    <p><strong>Tipo de Vacuna:</strong> {reporte5Data.TipoVacuna}</p>
                    <p><strong>Dosis:</strong> {reporte5Data.DosisVacuna} ml</p>
                    <p><strong>Próxima Vacunación:</strong> {formatFecha(reporte5Data.ProximaVacuna) || 'No disponible'}</p>
                  </>
                ) : (
                  <p>No hay registros de vacunación.</p>
                )}
              </div>

              {/* Historial de Traslados */}
              <div className="info-section-horizontal">
                <h4>Historial de Traslados</h4>
                {reporte5Data.FechaTraslado ? (
                  <>
                    <p><strong>Finca de Origen:</strong> {reporte5Data.FincaOrigen}</p>
                    <p><strong>Finca de Destino:</strong> {reporte5Data.FincaDestino}</p>
                    <p><strong>Fecha de Traslado:</strong> {formatFecha(reporte5Data.FechaTraslado)}</p>
                  </>
                ) : (
                  <p>No hay traslados registrados.</p>
                )}
              </div>

              {/* Servicios y Parto Estimado */}
              <div className="info-section-horizontal">
                <h4>Servicios y Parto Estimado</h4>
                {reporte5Data.FechaServicio ? (
                  <>
                    <p><strong>Fecha del Último Servicio:</strong> {formatFecha(reporte5Data.FechaServicio)}</p>
                    <p><strong>Condición:</strong> {reporte5Data.CondicionServicio}</p>
                    <p><strong>Edad del Servicio:</strong> {reporte5Data.EdadServicio} meses</p>
                    <p><strong>Fecha Estimada de Parto:</strong> {formatFecha(reporte5Data.FechaEstimadaParto)}</p>
                  </>
                ) : (
                  <p>No hay registros de servicios.</p>
                )}
              </div>

              {/* Registro de Salidas */}
              <div className="info-section-horizontal">
                <h4>Registro de Salidas</h4>
                {reporte5Data.FechaSalida ? (
                  <>
                    <p><strong>Fecha de Salida:</strong> {formatFecha(reporte5Data.FechaSalida)}</p>
                    <p><strong>Motivo:</strong> {reporte5Data.MotivoSalida}</p>
                    <p><strong>Comentarios:</strong> {reporte5Data.ComentariosSalida}</p>
                  </>
                ) : (
                  <p>No hay registros de salida.</p>
                )}
              </div>

              {/* Historial de Ventas */}
              <div className="info-section-horizontal section-highlight">
                <h4>Historial de Ventas</h4>
                {reporte5Data.FechaVenta ? (
                  <>
                    <p><strong>Fecha de Venta:</strong> {formatFecha(reporte5Data.FechaVenta)}</p>
                    <p><strong>Comprador:</strong> {reporte5Data.CompradorVenta}</p>
                    <p><strong>Precio:</strong> ${reporte5Data.PrecioVenta}</p>
                    <p><strong>Total:</strong> ${reporte5Data.TotalVenta}</p>
                  </>
                ) : (
                  <p>No hay registros de ventas.</p>
                )}
              </div>
            </div>
          ) : (
            <p>No se ha encontrado información para el número ingresado.</p>
          )}
        </div>

      </div>
    </div>

  );
};

export default ReporteGanadoScreen;
