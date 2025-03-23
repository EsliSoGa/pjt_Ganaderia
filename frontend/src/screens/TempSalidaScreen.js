import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TempSalidaContextProvider from '../context/TempSalidaContext';
import TempSalidaList from '../components/TempSalida/List';
import UploadImage from '../components/TempSalida/UploadImage'; // Importar el nuevo componente

function TempSalidaScreen() {
    return (
        <div className='TempSalidaScreen'>
            <TempSalidaContextProvider>
                <TempSalidaList />
                <UploadImage /> {/* Añadir el componente UploadImage */}
            </TempSalidaContextProvider>
        </div>
    );
}

export default TempSalidaScreen;
