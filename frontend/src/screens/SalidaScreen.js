import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import SalidaContextProvider from '../context/SalidaContext';
import SalidaList from '../components/Salida/List';

function SalidaScreen (){
    return (
        <div className='SalidaScreen'>
            <SalidaContextProvider>
                <SalidaList />
            </SalidaContextProvider>
        </div>
    );
}

export default SalidaScreen;