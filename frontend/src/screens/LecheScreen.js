import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import LecheContextProvider from '../context/LecheContext';
import LecheList from '../components/Leche/LecheList';

function LecheScreen() {
    return (
        <div className='LecheScreen'>
            <LecheContextProvider>
                <LecheList />
            </LecheContextProvider>
        </div>
    );
}

export default LecheScreen;
