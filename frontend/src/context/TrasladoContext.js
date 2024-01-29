import React, {createContext, useState, useEffect, useMemo } from "react";
import {TrasladoService} from "../services/TrasladoServices"

export const TrasladoContext = createContext();

const TrasladoContextProvider = (props)=>{
    const trasladoService = useMemo(() => new TrasladoService(), []);
    
    const [traslados, setTraslados] = useState([]);

    const [editTraslado, setEditTraslado] = useState(null);

    useEffect(() => {
        trasladoService.readAll().then((data) => setTraslados(data));
    }, [trasladoService, traslados]);

    const createTraslado =(traslado)=>{
        trasladoService
            .create(traslado)
            .then((data)=>setTraslados([...traslados, data]));
    };

    const deleteTraslado =(id)=>{
        trasladoService
            .delete(id)
            .then(()=>setTraslados(traslados.filter((p)=>p.id !== id)));
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
                traslados
            }}>
            {props.children}
        </TrasladoContext.Provider>
    );
};
export default TrasladoContextProvider;