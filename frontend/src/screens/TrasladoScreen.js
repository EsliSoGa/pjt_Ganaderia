import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TrasladoContextProvider from '../context/TrasladoContext';
import TrasladoList from '../components/Traslado/List';

function TrasladosScreen (){
    return (
        <div className='TrasladoScreen'>
            <TrasladoContextProvider>
                <TrasladoList />
            </TrasladoContextProvider>
        </div>
    );
}

export default TrasladosScreen;