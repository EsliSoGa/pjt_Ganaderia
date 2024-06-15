import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TempVentaContextProvider from '../context/TempVentaContext';
import TempVentaList from '../components/TempVentaTodos/List';

function TempVentaTotalScreen (){
    return (
        <div className='TempVentaTotalScreen'>
            <TempVentaContextProvider>
                <TempVentaList />
            </TempVentaContextProvider>
        </div>
    );
}

export default TempVentaTotalScreen;