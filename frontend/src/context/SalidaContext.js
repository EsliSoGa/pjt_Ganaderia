import React, {createContext, useState, useEffect, useMemo } from "react";
import {SalidaService} from "../services/SalidaServices"
import {GanadoService} from "../services/GanadoServices"

export const SalidaContext = createContext();

const SalidaContextProvider = (props)=>{
    const salidaService = useMemo(() => new SalidaService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [salidas, setSalidas] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editSalida, setEditSalida] = useState(null);

    useEffect(() => {
        salidaService.readAll().then((data) => setSalidas(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [salidaService, salidas, ganadoService, ganados]);

    const createSalida =(salida)=>{
        salidaService
            .create(salida)
            .then((data)=>setSalidas([...salidas, data]));
    };

    const deleteSalida =(id)=>{
        salidaService
            .delete(id)
            .then(()=>setSalidas(salidas.filter((p)=>p.id !== id)));
    };
    
    const findSalida =(id)=>{
        const salida = salidas.find((p)=>p.id === id);
        setEditSalida(salida);
    };

    const updateSalida =(salida)=>{
        salidaService
        .update(salida)
        .then((data)=>
            setSalidas(
                salidas.map((p)=>(p.id === salida.id ? data: salida))
            )
        );
        setEditSalida(null);
    };
    return(
        <SalidaContext.Provider 
            value={{
                createSalida,
                deleteSalida,
                findSalida,
                updateSalida,
                editSalida,
                salidas,
                ganados
            }}>
            {props.children}
        </SalidaContext.Provider>
    );
};
export default SalidaContextProvider;