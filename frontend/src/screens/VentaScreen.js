import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import VentaContextProvider from '../context/VentaContext';
import VentaList from '../components/Venta/List';

function VentaScreen (){
    return (
        <div className='VentaScreen'>
            <VentaContextProvider>
                <VentaList />
            </VentaContextProvider>
        </div>
    );
}

export default VentaScreen;