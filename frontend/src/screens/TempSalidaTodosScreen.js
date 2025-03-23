import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import TempSalidaContextProvider from '../context/TempSalidaContext';
import TempSalidaList from '../components/TempSalidaTodos/List';

function TempSalidaTodosScreen (){
    return (
        <div className='TempSalidaTodosScreen'>
            <TempSalidaContextProvider>
                <TempSalidaList />
            </TempSalidaContextProvider>
        </div>
    );
}

export default TempSalidaTodosScreen;