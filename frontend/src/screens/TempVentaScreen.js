import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TempVentaContextProvider from '../context/TempVentaContext';
import TempVentaList from '../components/TempVenta/List';

function TempVentaScreen (){
    return (
        <div className='TempVentaScreen'>
            <TempVentaContextProvider>
                <TempVentaList />
            </TempVentaContextProvider>
        </div>
    );
}

export default TempVentaScreen;