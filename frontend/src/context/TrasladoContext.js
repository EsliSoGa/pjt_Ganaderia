import React, {createContext, useState, useEffect, useMemo } from "react";
import {TrasladoService} from "../services/TrasladoServices"
import { GanadoService } from "../services/GanadoServices";

export const TrasladoContext = createContext();

const TrasladoContextProvider = (props)=>{
    const trasladoService = useMemo(() => new TrasladoService(), []);
    const ganadoService = useMemo(()=> new GanadoService(), []);
    
    const [traslados, setTraslados] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editTraslado, setEditTraslado] = useState(null);

    useEffect(() => {
        trasladoService.readAll().then((data) => setTraslados(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [trasladoService, traslados, ganadoService, ganados]);

    const createTraslado =(traslado)=>{
        trasladoService
            .create(traslado)
            .then((data)=>setTraslados([...traslados, data]));
    };

    const deleteTraslado =(traslado)=>{
        trasladoService
            .delete(traslado)
            .then(()=>setTraslados(traslados.filter((p)=>p.id !== traslado.id)));
    };
    
    const findTraslado =(id)=>{
        const traslado = traslados.find((p)=>p.id === id);
        setEditTraslado(traslado);
    };

    const updateTraslado =(traslado)=>{
        trasladoService
        .update(traslado)
        .then((data)=>
            setTraslados(
                traslados.map((p)=>(p.id === traslado.id ? data: traslado))
            )
        );
        setEditTraslado(null);
    };
    return(
        <TrasladoContext.Provider 
            value={{
                createTraslado,
                deleteTraslado,
                findTraslado,
                updateTraslado,
                editTraslado,
                traslados,
                ganados
            }}>
            {props.children}
        </TrasladoContext.Provider>
    );
};
export default TrasladoContextProvider;