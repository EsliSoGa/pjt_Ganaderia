import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useMediaQuery } from 'react-responsive';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ReporteGanadoScreen.css';

const ReporteGanadoScreen = () => {
    const [ganadoReporte, setGanadoReporte] = useState([]);
    const [lecheReporte, setLecheReporte] = useState([]);
    const [lecheGanadoOptions, setLecheGanadoOptions] = useState([]);
    const [selectedGanado, setSelectedGanado] = useState(null);
    const [ganadoChartData, setGanadoChartData] = useState(null);
    const [lecheChartData, setLecheChartData] = useState(null);
    const [reportType, setReportType] = useState('ganado');
    const [ganadoChartType, setGanadoChartType] = useState('pie');
    const [nacimientosIndividual, setNacimientosIndividual] = useState([]);
    const [nacimientosGeneral, setNacimientosGeneral] = useState([]);
    const [nacimientosConteo, setNacimientosConteo] = useState([]);
    const [detalladoReporte, setDetalladoReporte] = useState(null);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        fetchGanadoReporte();
        fetchLecheGanadoOptions();
        fetchLecheGeneralReporte();
        fetchNacimientosGeneral();
    }, []);

    useEffect(() => {
        if (selectedGanado) {
            fetchNacimientosIndividual(selectedGanado);
            fetchDetalladoReporte(selectedGanado);
        }
    }, [selectedGanado]);

    const fetchGanadoReporte = async () => {
        try {
            const response = await axios.get("http://localhost:8080/reporte/ganado");
            if (Array.isArray(response.data)) {
                setGanadoReporte(response.data);
                generateGanadoChartData(response.data);
            } else {
                console.error("La respuesta del servidor no es un array:", response.data);
            }
        } catch (error) {
            console.error("Error fetching ganado report:", error);
        }
    };

    const fetchLecheGanadoOptions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/ganado");
            setLecheGanadoOptions(response.data.map(g => ({ label: g.numero, value: g.id })));
        } catch (error) {
            console.error("Error fetching ganados:", error);
        }
    };

    const fetchLecheGeneralReporte = async () => {
        try {
            const response = await axios.get("http://localhost:8080/reporte/leche/general");
            generateLecheChartData(response.data);
        } catch (error) {
            console.error("Error fetching leche report:", error);
        }
    };

    const fetchNacimientosIndividual = async (id_ganado) => {
        try {
            const response = await axios.get(`http://localhost:8080/reporte/servicio/nacimientos/individual/${id_ganado}`);
            setNacimientosIndividual(response.data);
        } catch (error) {
            console.error("Error fetching nacimientos individuales:", error);
        }
    };

    const fetchNacimientosGeneral = async () => {
        try {
            const response = await axios.get("http://localhost:8080/reporte/servicio/nacimientos/general");
            setNacimientosGeneral(response.data);
        } catch (error) {
            console.error("Error fetching nacimientos generales:", error);
        }
    };

    const fetchNacimientosConteo = async () => {
        try {
            const response = await axios.get("http://localhost:8080/reporte/servicio/nacimientos/conteo");
            setNacimientosConteo(response.data);
        } catch (error) {
            console.error("Error fetching conteo de nacimientos:", error);
        }
    };

    const fetchDetalladoReporte = async (id_ganado) => {
        try {
            const response = await axios.get(`http://localhost:8080/reporte/detallado/${id_ganado}`);
            setDetalladoReporte(response.data);
        } catch (error) {
            console.error("Error fetching detallado reporte:", error);
        }
    };

    const generateGanadoChartData = (data) => {
        const tipos = data.reduce((acc, curr) => {
            acc[curr.tipo] = (acc[curr.tipo] || 0) + curr.cantidad;
            return acc;
        }, {});

        const labels = Object.keys(tipos);
        const values = Object.values(tipos);

        setGanadoChartData({
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }
            ]
        });
    };

    const generateLecheChartData = (data) => {
        const labels = data.map(item => item.semana || item.Fecha);
        const values = data.map(item => item.total_produccion);

        setLecheChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Producción de Leche',
                    data: values,
                    fill: false,
                    borderColor: '#4bc0c0',
                    tension: 0.1
                }
            ]
        });
    };

    const downloadGanadoPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Ganado", 10, 10);

        if (ganadoChartType === 'list') {
            const tableColumn = ["Tipo", "Cantidad"];
            const tableRows = [];

            for (let item of ganadoReporte) {
                tableRows.push([item.tipo, item.cantidad]);
            }

            doc.autoTable(tableColumn, tableRows, { startY: 20 });
        } else if (ganadoChartType === 'pie' && ganadoChartData) {
            // Incluir lógica para gráficos si es necesario
        }

        doc.save("reporte_ganado.pdf");
    };

    const downloadLechePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Producción de Leche", 10, 10);

        if (lecheChartData) {
            const tableColumn = ["Fecha", "Producción (L)"];
            const tableRows = [];

            for (let i = 0; i < lecheChartData.labels.length; i++) {
                tableRows.push([lecheChartData.labels[i], lecheChartData.datasets[0].data[i]]);
            }

            doc.autoTable(tableColumn, tableRows, { startY: 20 });
        }

        doc.save("reporte_leche.pdf");
    };

    const downloadNacimientosIndividualPDF = () => {
        const doc = new jsPDF();
        doc.text("Informe Individual de Nacimientos", 10, 10);

        if (nacimientosIndividual) {
            const tableColumn = ["Nombre del Ganado", "Meses del Feto", "Fecha del Servicio", "Fecha Tentativa de Nacimiento"];
            const tableRows = [];

            for (let item of nacimientosIndividual) {
                tableRows.push([item.NombreGanado, item.Meses, item.Fecha, item.FechaNacimiento]);
            }

            doc.autoTable(tableColumn, tableRows, { startY: 20 });
        }

        doc.save("reporte_nacimientos_individual.pdf");
    };

    const downloadNacimientosGeneralPDF = () => {
        const doc = new jsPDF();
        doc.text("Informe General de Nacimientos", 10, 10);

        if (nacimientosGeneral) {
            const tableColumn = ["Nombre del Ganado", "Meses del Feto", "Fecha del Servicio", "Fecha Tentativa de Nacimiento"];
            const tableRows = [];

            for (let item of nacimientosGeneral) {
                tableRows.push([item.NombreGanado, item.Meses, item.Fecha, item.FechaNacimiento]);
            }

            doc.autoTable(tableColumn, tableRows, { startY: 20 });
        }

        doc.save("reporte_nacimientos_general.pdf");
    };

    const downloadNacimientosConteoPDF = () => {
        const doc = new jsPDF();
        doc.text("Conteo de Nacimientos", 10, 10);

        if (nacimientosConteo) {
            const tableColumn = ["Nombre del Ganado", "Color", "Fecha del Servicio", "Fecha Tentativa de Nacimiento", "Producción Diaria"];
            const tableRows = [];

            for (let item of nacimientosConteo) {
                tableRows.push([item.NombreGanado, item.Color, item.Fecha, item.FechaNacimiento, item.Produccion_diaria]);
            }

            doc.autoTable(tableColumn, tableRows, { startY: 20 });
        }

        doc.save("reporte_conteo_nacimientos.pdf");
    };

    const downloadDetalladoPDF = () => {
        const doc = new jsPDF('landscape');
        doc.text("Reporte Detallado de Ganado", 10, 10);

        if (detalladoReporte) {
            const tableRows = [];

            tableRows.push(['Nombre', detalladoReporte.Nombre]);
            tableRows.push(['Número', detalladoReporte.Numero]);
            tableRows.push(['Sexo', detalladoReporte.Sexo]);
            tableRows.push(['Color', detalladoReporte.Color]);
            tableRows.push(['Peso', detalladoReporte.Peso]);
            tableRows.push(['Fecha de Nacimiento', detalladoReporte.FechaNacimiento]);
            tableRows.push(['Tipo', detalladoReporte.Tipo]);
            tableRows.push(['Finca', detalladoReporte.Finca]);
            tableRows.push(['Estado', detalladoReporte.Estado]);
            tableRows.push(['Comentarios', detalladoReporte.Comentarios]);
            tableRows.push(['Estado Secundario', detalladoReporte.estado_secundario]);

            // Agregar secciones de tablas
            tableRows.push(['Traslados', '']);
            detalladoReporte.Traslados.forEach(item => {
                tableRows.push([`Fecha: ${item.Fecha}`, `Origen: ${item.Finca_origen}`, `Destino: ${item.Finca_destino}`]);
            });

            tableRows.push(['Ventas', '']);
            detalladoReporte.Ventas.forEach(item => {
                tableRows.push([`Fecha: ${item.Fecha}`, `Comprador: ${item.Comprador}`, `Precio: ${item.Precio}`, `Peso: ${item.Peso}`, `Total: ${item.Total}`]);
            });

            tableRows.push(['Servicios', '']);
            detalladoReporte.Servicios.forEach(item => {
                tableRows.push([`Fecha: ${item.Fecha}`, `Condición: ${item.Condicion}`, `Edad: ${item.Edad}`, `Comentario: ${item.Comentario}`]);
            });

            tableRows.push(['Salidas', '']);
            detalladoReporte.Salidas.forEach(item => {
                tableRows.push([`Fecha: ${item.Fecha}`, `Motivo: ${item.Motivo}`, `Comentarios: ${item.Comentarios}`, `Imagen: ${item.Imagen}`]);
            });

            tableRows.push(['Vacunas', '']);
            detalladoReporte.Vacunas.forEach(item => {
                tableRows.push([`Fecha de Aplicación: ${item.Fecha_aplicacion}`, `Tipo de Vacuna: ${item.Tipo_vacuna}`, `Dosis: ${item.Dosis}`, `Próxima Aplicación: ${item.Proxima_aplicacion}`, `Responsable: ${item.Responsable}`, `Observaciones: ${item.Observaciones}`]);
            });

            tableRows.push(['Fecha Tentativa de Nacimiento', '']);
            detalladoReporte.FechaTentativaNacimiento.forEach(item => {
                tableRows.push([`Fecha: ${item.Fecha}`]);
            });

            tableRows.push(['Padres', '']);
            if (detalladoReporte.Padres) {
                tableRows.push([`Padre: ${detalladoReporte.Padres.Padre}`, `Madre: ${detalladoReporte.Padres.Madre}`, `Tipo de Nacimiento: ${detalladoReporte.Padres.TipoNacimiento}`]);
            }

            doc.autoTable({
                head: [['Atributo', 'Valor']],
                body: tableRows,
                startY: 20,
                theme: 'striped',
                styles: { overflow: 'linebreak' },
            });
        }

        doc.save("reporte_detallado.pdf");
    };

    const handleFetchNacimientosConteo = () => {
        fetchNacimientosConteo();
    };

    const renderDetalladoReporte = () => {
        if (!detalladoReporte) return null;

        return (
            <div className="detallado-container">
                <h2>Reporte Detallado</h2>
                <div className="info-general">
                    <h3>Información General</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td className="info-column">
                                    <table className="info-table">
                                        <tr><td>Nombre:</td><td>{detalladoReporte.Nombre}</td></tr>
                                        <tr><td>Número:</td><td>{detalladoReporte.Numero}</td></tr>
                                        <tr><td>Sexo:</td><td>{detalladoReporte.Sexo}</td></tr>
                                        <tr><td>Color:</td><td>{detalladoReporte.Color}</td></tr>
                                        <tr><td>Peso:</td><td>{detalladoReporte.Peso}</td></tr>
                                        <tr><td>Fecha de Nacimiento:</td><td>{detalladoReporte.FechaNacimiento}</td></tr>
                                        <tr><td>Tipo:</td><td>{detalladoReporte.Tipo}</td></tr>
                                        <tr><td>Finca:</td><td>{detalladoReporte.Finca}</td></tr>
                                        <tr><td>Estado:</td><td>{detalladoReporte.Estado}</td></tr>
                                        <tr><td>Comentarios:</td><td>{detalladoReporte.Comentarios}</td></tr>
                                        <tr><td>Estado Secundario:</td><td>{detalladoReporte.estado_secundario}</td></tr>
                                    </table>
                                </td>
                                <td className="image-column">
                                    <img id="imagen" src={`http://localhost:8080/${detalladoReporte.Imagen}`} alt="Imagen del Ganado" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Traslados</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Origen</th>
                                <th>Destino</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalladoReporte.Traslados.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Fecha}</td>
                                    <td>{item.Finca_origen}</td>
                                    <td>{item.Finca_destino}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Ventas</h3>
                    <table>
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
                            {detalladoReporte.Ventas.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Fecha}</td>
                                    <td>{item.Comprador}</td>
                                    <td>{item.Precio}</td>
                                    <td>{item.Peso}</td>
                                    <td>{item.Total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Servicios</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Condición</th>
                                <th>Edad</th>
                                <th>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalladoReporte.Servicios.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Fecha}</td>
                                    <td>{item.Condicion}</td>
                                    <td>{item.Edad}</td>
                                    <td>{item.Comentario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Salidas</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Motivo</th>
                                <th>Comentarios</th>
                                <th>Imagen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalladoReporte.Salidas.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Fecha}</td>
                                    <td>{item.Motivo}</td>
                                    <td>{item.Comentarios}</td>
                                    <td className="image-column"><img src={`http://localhost:8080/${item.Imagen}`} alt="Imagen de la Salida" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Vacunas</h3>
                    <table>
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
                            {detalladoReporte.Vacunas.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Fecha_aplicacion}</td>
                                    <td>{item.Tipo_vacuna}</td>
                                    <td>{item.Dosis}</td>
                                    <td>{item.Proxima_aplicacion}</td>
                                    <td>{item.Responsable}</td>
                                    <td>{item.Observaciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Fecha Tentativa de Nacimiento</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalladoReporte.FechaTentativaNacimiento.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Fecha}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h3>Relación de Padres</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Padre</th>
                                <th>Madre</th>
                                <th>Tipo de Nacimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalladoReporte.Padres && (
                                <tr>
                                    <td>{detalladoReporte.Padres.Padre}</td>
                                    <td>{detalladoReporte.Padres.Madre}</td>
                                    <td>{detalladoReporte.Padres.TipoNacimiento}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="reporte-container">
            <h1>Reporte</h1>
            <Dropdown
                value={reportType}
                options={[
                    { label: 'Ganado', value: 'ganado' },
                    { label: 'Leche', value: 'leche' },
                    { label: 'Nacimientos Individuales', value: 'nacimientos_individuales' },
                    { label: 'Nacimientos Generales', value: 'nacimientos_generales' },
                    { label: 'Conteo de Nacimientos', value: 'conteo_nacimientos' },
                    { label: 'Detallado', value: 'detallado' }
                ]}
                onChange={(e) => setReportType(e.value)}
                placeholder="Seleccione el tipo de reporte"
            />
            {reportType === 'ganado' && (
                <>
                    <Dropdown
                        value={ganadoChartType}
                        options={[
                            { label: 'Pie', value: 'pie' },
                            { label: 'List', value: 'list' }
                        ]}
                        onChange={(e) => setGanadoChartType(e.value)}
                        placeholder="Seleccione el tipo de gráfico"
                    />
                    {ganadoChartType === 'pie' && ganadoChartData && (
                        <div className="chart-container">
                            <Chart type="pie" data={ganadoChartData} />
                        </div>
                    )}
                    {ganadoChartType === 'list' && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(ganadoReporte) && ganadoReporte.map((item) => (
                                    <tr key={item.tipo}>
                                        <td>{item.tipo}</td>
                                        <td>{item.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" onClick={downloadGanadoPDF} className="download-button" />
                </>
            )}
            {reportType === 'leche' && (
                <>
                    <Dropdown
                        value={selectedGanado}
                        options={[{ label: 'General', value: null }, ...lecheGanadoOptions]}
                        onChange={(e) => setSelectedGanado(e.value)}
                        placeholder="Seleccione el ganado"
                    />
                    {lecheChartData && (
                        <div className="chart-container">
                            <Chart type="line" data={lecheChartData} />
                        </div>
                    )}
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" onClick={downloadLechePDF} className="download-button" />
                </>
            )}
            {reportType === 'nacimientos_individuales' && (
                <>
                    <Dropdown
                        value={selectedGanado}
                        options={lecheGanadoOptions}
                        onChange={(e) => setSelectedGanado(e.value)}
                        placeholder="Seleccione el ganado"
                    />
                    {nacimientosIndividual.length > 0 && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Ganado</th>
                                    <th>Meses del Feto</th>
                                    <th>Fecha del Servicio</th>
                                    <th>Fecha Tentativa de Nacimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nacimientosIndividual.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.NombreGanado}</td>
                                        <td>{item.Meses}</td>
                                        <td>{item.Fecha}</td>
                                        <td>{item.FechaNacimiento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" onClick={downloadNacimientosIndividualPDF} className="download-button" />
                </>
            )}
            {reportType === 'nacimientos_generales' && (
                <>
                    {nacimientosGeneral && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Ganado</th>
                                    <th>Meses del Feto</th>
                                    <th>Fecha del Servicio</th>
                                    <th>Fecha Tentativa de Nacimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nacimientosGeneral.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.NombreGanado}</td>
                                        <td>{item.Meses}</td>
                                        <td>{item.Fecha}</td>
                                        <td>{item.FechaNacimiento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" onClick={downloadNacimientosGeneralPDF} className="download-button" />
                </>
            )}
            {reportType === 'conteo_nacimientos' && (
                <>
                    <Button label="Obtener Conteo" icon="pi pi-search" onClick={handleFetchNacimientosConteo} className="fetch-button" />
                    {nacimientosConteo && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Ganado</th>
                                    <th>Color</th>
                                    <th>Fecha del Servicio</th>
                                    <th>Fecha Tentativa de Nacimiento</th>
                                    <th>Producción Diaria</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nacimientosConteo.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.NombreGanado}</td>
                                        <td>{item.Color}</td>
                                        <td>{item.Fecha}</td>
                                        <td>{item.FechaNacimiento}</td>
                                        <td>{item.Produccion_diaria}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" onClick={downloadNacimientosConteoPDF} className="download-button" />
                </>
            )}
            {reportType === 'detallado' && (
                <>
                    <Dropdown
                        value={selectedGanado}
                        options={lecheGanadoOptions}
                        onChange={(e) => {
                            setSelectedGanado(e.value);
                            fetchDetalladoReporte(e.value);
                        }}
                        placeholder="Seleccione el ganado"
                    />
                    {renderDetalladoReporte()}
                    <Button label="Descargar PDF" icon="pi pi-file-pdf" onClick={downloadDetalladoPDF} className="download-button" />
                </>
            )}
        </div>
    );
};

export default ReporteGanadoScreen;
