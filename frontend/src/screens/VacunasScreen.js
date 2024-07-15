import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import VacunasContextProvider from '../context/VacunasContext';
import VacunasList from '../components/Vacunas/VacunasList';

function VacunasScreen (){
    return (
        <div className='VacunasScreen'>
            <VacunasContextProvider>
                <VacunasList />
            </VacunasContextProvider>
        </div>
    );
}

export default VacunasScreen;
