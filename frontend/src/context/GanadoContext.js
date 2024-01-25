import React, {createContext, useState, useEffect, useMemo } from "react";
import {GanadoService} from "../services/GanadoServices"

export const GanadoContext = createContext();

const GanadoContextProvider = (props)=>{
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [ganados, setGanados] = useState([]);

    const [editGanados, setEditGanados] = useState(null);

    useEffect(() => {
        ganadoService.readAll().then((data) => setGanados(data));
    }, [ganadoService, ganados]);

    const createGanado =(ganado)=>{
        ganadoService
            .create(ganado)
            .then((data)=>setGanados([...ganados, data]));
    };

    const deleteGanado =(id)=>{
        ganadoService
            .delete(id)
            .then(()=>setGanados(ganados.filter((p)=>p.id !== id)));
    };
    
    const findGanado =(id)=>{
        const ganado = ganados.find((p)=>p.id === id);
        setEditGanados(ganado);
    };
    
    const updateGanado =(ganado)=>{
        ganadoService
        .update(ganado)
        .then((data)=>
            setGanados(
                ganados.map((p)=>(p.id === ganado.id ? data: ganado))
            )
        );
        setEditGanados(null);
    };
    return(
        <GanadoContext.Provider 
            value={{
                createGanado,
                deleteGanado,
                findGanado,
                updateGanado,
                editGanados,
                ganados,
            }}>
            {props.children}
        </GanadoContext.Provider>
    );
};
export default GanadoContextProvider;