import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import GanadoContextProvider from '../context/GanadoContext';
import GanadoList from '../components/Ganado/List';
import UploadImage from '../components/Ganado/UploadImage';

function GanadoScreen (){
    return (
        <div className='GanadoScreen'>
            <GanadoContextProvider>
                <GanadoList />
                <UploadImage /> {/* Añadir el componente UploadImage */}
            </GanadoContextProvider>
        </div>
    );
}

export default GanadoScreen;
