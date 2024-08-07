import React from "react";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import UsuarioContextProvider from '../context/UsuarioContext';
import UsuarioList from "../components/Usuario/List";

function UsuariosScreen (){
    return (
        <div className='UsuariosScreen'>
            <UsuarioContextProvider>
                <UsuarioList />
            </UsuarioContextProvider>
        </div>
    );
}

export default UsuariosScreen;