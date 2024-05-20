import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Galleria } from 'primereact/galleria';

const Home = () => {
    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];
    return (
        <><div className="about-container">
            <div className="about-desc">
                <h3>Hospital Nacional de Retalhuleu</h3>
                <p align="justify">
                    Este centro médico es una entidad hospitalaria, que depende
                    del Ministerio de Salud Pública y Asistencia Social de Guatemala, y es
                    responsable de promover la atención en salud, con calidad y respeto a los
                    pacientes que lo necesiten, mediante la atención en prevención, recuperación
                    y rehabilitación de enfermedades. Así pues, cuentan con un recurso humano que
                    hace un excelente uso de las tecnologías del establecimiento para tratar de
                    mejorar la vida de quienes necesiten de los servicios médicos.
                </p>
            </div>
        </div><div>
                <footer>
                    <p>&copy;Todos los derechos reservados :: López, Galicia :: 2024</p>
                </footer>
            </div></>
    );
};

export default Home;