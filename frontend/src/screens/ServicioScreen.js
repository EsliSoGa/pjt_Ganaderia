import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ServicioContextProvider from '../context/ServicioContext';
import ServicioList from '../components/Servicio/List';

function ServiciosScreen (){
    return (
        <div className='ServiciosScreen'>
            <ServicioContextProvider>
                <ServicioList />
            </ServicioContextProvider>
        </div>
    );
}

export default ServiciosScreen;