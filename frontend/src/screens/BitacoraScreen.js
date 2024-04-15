import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import BitacoraContextProvider from '../context/BitacoraContext';
import BitacoraList from '../components/Bitacora/List';

function BitacoraScreen (){
    return (
        <div className='BitacoraScreen'>
            <BitacoraContextProvider>
                <BitacoraList />
            </BitacoraContextProvider>
        </div>
    );
}

export default BitacoraScreen;