import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TempSalidaContextProvider from '../context/TempSalidaContext';
import TempSalidaList from '../components/TempSalida/List';

function TempSalidaScreen (){
    return (
        <div className='TempSalidaScreen'>
            <TempSalidaContextProvider>
                <TempSalidaList />
            </TempSalidaContextProvider>
        </div>
    );
}

export default TempSalidaScreen;