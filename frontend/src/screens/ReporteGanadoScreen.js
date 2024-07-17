import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
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
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        fetchGanadoReporte();
        fetchLecheGanadoOptions();
        fetchLecheGeneralReporte();
        fetchNacimientosIndividual(selectedGanado);
        fetchNacimientosGeneral();
    }, []);

    useEffect(() => {
        if (selectedGanado) {
            fetchNacimientosIndividual(selectedGanado);
        } else {
            fetchNacimientosGeneral();
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
            const response = await axios.get(http://localhost:8080/reporte/servicio/nacimientos/individual/${id_ganado});
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

    const handleFetchNacimientosConteo = () => {
        fetchNacimientosConteo();
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + ' unidades';
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                color: 'black',
                formatter: (value, context) => {
                    return value;
                }
            }
        }
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
                    { label: 'Conteo de Nacimientos', value: 'conteo_nacimientos' }
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
                            <Chart type="pie" data={ganadoChartData} options={options} />
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
                            <Chart type="line" data={lecheChartData} options={options} />
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
                    {nacimientosIndividual && (
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
        </div>
    );
};

export default ReporteGanadoScreen;