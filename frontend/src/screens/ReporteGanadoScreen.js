import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
    PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, LineChart, Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './ReporteGanadoScreen.css';

const ReporteGanadoScreen = () => {
    const [reporteGanado, setReporteGanado] = useState([]);
    const [reporteLecheIndividual, setReporteLecheIndividual] = useState([]);
    const [reporteLecheGeneral, setReporteLecheGeneral] = useState([]);
    const [reporteNacimientosGeneral, setReporteNacimientosGeneral] = useState([]);
    const [idGanado, setIdGanado] = useState('');
    const [finca, setFinca] = useState(null);
    const [detalladoGanado, setDetalladoGanado] = useState(null);
    const [idDetallado, setIdDetallado] = useState('');
    const [ganadoList, setGanadoList] = useState([]);

    useEffect(() => {
        fetchReportes();
    }, [finca]);

    const fetchReportes = () => {
        fetchGanadoList();
        fetchReporteGanado();
        fetchReporteLecheGeneral();
        fetchReporteNacimientosGeneral();
    };

    const fetchReporteGanado = async () => {
        try {
            const response = await axios.get('http://localhost:8080/reporte/ganado', {
                params: { finca: finca ? finca.value : '' }
            });
            setReporteGanado(response.data);
        } catch (error) {
            console.error("Error fetching ganado report:", error);
        }
    };

    const fetchReporteLecheGeneral = async () => {
        try {
            const response = await axios.get('http://localhost:8080/reporte/leche/general', {
                params: { finca: finca ? finca.value : '' }
            });
            setReporteLecheGeneral(response.data);
        } catch (error) {
            console.error("Error fetching leche general report:", error);
        }
    };

    const fetchReporteNacimientosGeneral = async () => {
        try {
            const response = await axios.get('http://localhost:8080/reporte/nacimientos/general', {
                params: { finca: finca ? finca.value : '' }
            });
            setReporteNacimientosGeneral(response.data);
        } catch (error) {
            console.error("Error fetching nacimientos generales:", error);
        }
    };

    const fetchReporteLecheIndividual = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/reporte/leche/individual/${idGanado}`, {
                params: { finca: finca ? finca.value : '' }
            });
            setReporteLecheIndividual(response.data);
        } catch (error) {
            console.error("Error fetching leche individual report:", error);
        }
    };

    const fetchReporteDetallado = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/reporte/detallado/${idDetallado}`);
            setDetalladoGanado(response.data);
        } catch (error) {
            console.error("Error fetching detallado report:", error);
        }
    };

    const fetchGanadoList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/reporte/ganado/list', {
                params: { finca: finca ? finca.value : '' }
            });
            setGanadoList(response.data);
        } catch (error) {
            console.error("Error fetching ganado list:", error);
        }
    };

    const handleGanadoChange = (selectedOption) => {
        setIdGanado(selectedOption ? selectedOption.value : '');
    };

    const handleDetalladoChange = (selectedOption) => {
        setIdDetallado(selectedOption ? selectedOption.value : '');
    };

    const handleFincaChange = (selectedOption) => {
        setFinca(selectedOption);
        setIdGanado('');
        setIdDetallado('');
    };

    const fincaOptions = [...new Set(reporteGanado.map(item => item.Finca))].map(finca => ({ value: finca, label: finca }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const renderGanadoReporte = () => {
        const filteredData = finca ? reporteGanado.filter(item => item.Finca === finca.value) : reporteGanado;
        const tiposGanado = [...new Set(filteredData.map(item => item.Tipo))];
        const data = tiposGanado.map((tipo, index) => ({
            name: tipo,
            value: filteredData.reduce((acc, item) => item.Tipo === tipo ? acc + item.cantidad : acc, 0),
            fill: COLORS[index % COLORS.length],
        }));

        return (
            <div className="reporte-section">
                <h2>Reporte de Ganado</h2>
                <Select
                    options={fincaOptions}
                    onChange={handleFincaChange}
                    value={finca}
                    placeholder="Seleccione una finca"
                    isClearable
                />
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" outerRadius={150} fill="#8884d8">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderLecheIndividualReporte = () => {
        const data = reporteLecheIndividual.map(item => ({
            x: new Date(item.Fecha).getTime(),
            y: item.Produccion_diaria
        }));

        const ganadoOptions = finca
            ? ganadoList.filter(ganado => ganado.Finca === finca.value).map(ganado => ({ value: ganado.id, label: ganado.Numero }))
            : ganadoList.map(ganado => ({ value: ganado.id, label: ganado.Numero }));

        return (
            <div className="reporte-section">
                <h2>Reporte de Leche Individual</h2>
                <Select
                    options={ganadoOptions}
                    onChange={handleGanadoChange}
                    value={ganadoOptions.find(option => option.value === idGanado)}
                    placeholder="Seleccione un ganado"
                    isClearable
                />
                <button onClick={fetchReporteLecheIndividual}>Generar Reporte</button>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            domain={['dataMin', 'dataMax']}
                            name="Fecha"
                            tickFormatter={timeStr => new Date(timeStr).toLocaleDateString()}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Producción Diaria"
                            unit="l"
                        />
                        <Tooltip
                            labelFormatter={label => new Date(label).toLocaleDateString()}
                            formatter={(value, name) => [`${value} l`, 'Producción Diaria']}
                        />
                        <Line
                            type="monotone"
                            dataKey="y"
                            stroke="#8884d8"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };


    const renderLecheGeneralReporte = () => {
        const data = reporteLecheGeneral.map(item => ({
            x: new Date(item.Fecha).getTime(),
            y: item.promedio_produccion
        }));

        return (
            <div className="reporte-section">
                <h2>Reporte de Leche General</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            domain={['dataMin', 'dataMax']}
                            name="Fecha"
                            tickFormatter={timeStr => new Date(timeStr).toLocaleDateString()}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Producción Promedio Diaria"
                            unit="l"
                        />
                        <Tooltip
                            labelFormatter={label => new Date(label).toLocaleDateString()}
                            formatter={(value, name) => [`${value} l`, 'Producción Promedio Diaria']}
                        />
                        <Line
                            type="monotone"
                            dataKey="y"
                            stroke="#8884d8"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderNacimientosGeneralReporte = () => {
        return (
            <div className="reporte-section">
                <h2>Reporte de Nacimientos General</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre Ganado</th>
                            <th>Fecha</th>
                            <th>Fecha Probable de Parto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reporteNacimientosGeneral.map((item, index) => (
                            <tr key={index}>
                                <td>{item.NombreGanado}</td>
                                <td>{item.Fecha}</td>
                                <td>{item.FechaProbableParto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderDetalladoReporte = () => {
        if (!detalladoGanado) return null;

        const ganadoOptions = finca
            ? ganadoList.filter(g => g.Finca === finca.value).map(ganado => ({ value: ganado.id, label: ganado.Numero }))
            : ganadoList.map(ganado => ({ value: ganado.id, label: ganado.Numero }));

        return (
            <div className="reporte-section">
                <h2>Reporte Detallado</h2>
                <Select
                    options={ganadoOptions}
                    onChange={handleDetalladoChange}
                    value={ganadoOptions.find(option => option.value === idDetallado)}
                    placeholder="Seleccione un ganado"
                    isClearable
                />
                <button onClick={fetchReporteDetallado}>Generar Reporte</button>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Información General</th>
                            <th></th>
                            <th>Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nombre</td>
                            <td>{detalladoGanado.Nombre}</td>
                            <td rowSpan="10" className="image-cell">
                                {detalladoGanado.Imagen && (
                                    <img src={`http://localhost:8080/${detalladoGanado.Imagen}`} alt={detalladoGanado.Nombre} className="responsive-image" />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Número</td>
                            <td>{detalladoGanado.Numero}</td>
                        </tr>
                        <tr>
                            <td>Sexo</td>
                            <td>{detalladoGanado.Sexo}</td>
                        </tr>
                        <tr>
                            <td>Color</td>
                            <td>{detalladoGanado.Color}</td>
                        </tr>
                        <tr>
                            <td>Peso</td>
                            <td>{detalladoGanado.Peso}</td>
                        </tr>
                        <tr>
                            <td>Fecha de Nacimiento</td>
                            <td>{detalladoGanado.FechaNacimiento}</td>
                        </tr>
                        <tr>
                            <td>Tipo</td>
                            <td>{detalladoGanado.Tipo}</td>
                        </tr>
                        <tr>
                            <td>Finca</td>
                            <td>{detalladoGanado.Finca}</td>
                        </tr>
                        <tr>
                            <td>Estado</td>
                            <td>{detalladoGanado.Estado}</td>
                        </tr>
                        <tr>
                            <td>Comentarios</td>
                            <td>{detalladoGanado.Comentarios}</td>
                        </tr>
                        <tr>
                            <td>Estado Secundario</td>
                            <td>{detalladoGanado.estado_secundario}</td>
                        </tr>
                        <tr>
                            <td>Fecha Tentativa de Nacimiento</td>
                            <td>{detalladoGanado.FechaTentativaNacimiento}</td>
                        </tr>
                        <tr>
                            <td>Padres</td>
                            <td>{detalladoGanado.Padres ? `Padre: ${detalladoGanado.Padres.Padre}, Madre: ${detalladoGanado.Padres.Madre}, Tipo de Nacimiento: ${detalladoGanado.Padres.TipoNacimiento}` : 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
                <h3>Traslados</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Finca Origen</th>
                            <th>Finca Destino</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detalladoGanado.Traslados.map((traslado, index) => (
                            <tr key={index}>
                                <td>{traslado.Fecha}</td>
                                <td>{traslado.Finca_origen}</td>
                                <td>{traslado.Finca_destino}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Ventas</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Comprador</th>
                            <th>Precio</th>
                            <th>Peso</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detalladoGanado.Ventas.map((venta, index) => (
                            <tr key={index}>
                                <td>{venta.Fecha}</td>
                                <td>{venta.Comprador}</td>
                                <td>{venta.Precio}</td>
                                <td>{venta.Peso}</td>
                                <td>{venta.Total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Servicios</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Condición</th>
                            <th>Edad</th>
                            <th>Comentario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detalladoGanado.Servicios.map((servicio, index) => (
                            <tr key={index}>
                                <td>{servicio.Fecha}</td>
                                <td>{servicio.Condicion}</td>
                                <td>{servicio.Edad}</td>
                                <td>{servicio.Comentario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Salidas</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Imagen</th>
                            <th>Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detalladoGanado.Salidas.map((salida, index) => (
                            <tr key={index}>
                                <td>{salida.Fecha}</td>
                                <td>{salida.Motivo}</td>
                                <td><img src={`http://localhost:8080/${salida.Imagen}`} alt={salida.Motivo} className="responsive-image-small" /></td>
                                <td>{salida.Comentarios}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Vacunas</h3>
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Fecha de Aplicación</th>
                            <th>Tipo de Vacuna</th>
                            <th>Dosis</th>
                            <th>Próxima Aplicación</th>
                            <th>Responsable</th>
                            <th>Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detalladoGanado.Vacunas.map((vacuna, index) => (
                            <tr key={index}>
                                <td>{vacuna.Fecha_aplicacion}</td>
                                <td>{vacuna.Tipo_vacuna}</td>
                                <td>{vacuna.Dosis}</td>
                                <td>{vacuna.Proxima_aplicacion}</td>
                                <td>{vacuna.Responsable}</td>
                                <td>{vacuna.Observaciones}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="reporte-container">
            {renderGanadoReporte()}
            {renderLecheIndividualReporte()}
            {renderLecheGeneralReporte()}
            {renderNacimientosGeneralReporte()}
            <div className="reporte-section">
                <h2>Reporte Detallado</h2>
                <Select
                    options={ganadoList.map(ganado => ({ value: ganado.id, label: ganado.Numero }))}
                    onChange={handleDetalladoChange}
                    value={ganadoList.find(option => option.value === idDetallado)}
                    placeholder="Seleccione un ganado"
                    isClearable
                />
                <button onClick={fetchReporteDetallado}>Generar Reporte</button>
            </div>
            {renderDetalladoReporte()}
        </div>
    );
};

export default ReporteGanadoScreen;
