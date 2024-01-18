import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import GanadoContextProvider from '../context/GanadoContext';
import GanadoList from '../components/Ganado/List';

function GanadoScreen (){
    return (
        <div className='GanadoScreen'>
            <GanadoContextProvider>
                <GanadoList />
            </GanadoContextProvider>
        </div>
    );
}

export default GanadoScreen;