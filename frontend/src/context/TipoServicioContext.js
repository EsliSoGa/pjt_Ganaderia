import React, {createContext, useState, useEffect, useMemo } from "react";
import {TipoServicioService} from "../services/tipoServiciosService"

export const TipoServicioContext = createContext();

const TipoServicioContextProvider = (props)=>{
    const tipoServicioService = useMemo(() => new TipoServicioService(), []);
    
    const [tipoServicios, setTipoServicios] = useState([]);

    const [editTipoServicios, setEditTipoServicios] = useState(null);

    useEffect(() => {
        tipoServicioService.readAll().then((data) => setTipoServicios(data));
    }, [tipoServicioService, tipoServicios]);

    const createTipoServicio =(tipoServicio)=>{
        tipoServicioService
            .create(tipoServicio)
            .then((data)=>setTipoServicios([...tipoServicio, data]));
    };

    const deleteTipoServicio =(id)=>{
        tipoServicioService
            .delete(id)
            .then(()=>setTipoServicios(tipoServicios.filter((p)=>p.id !== id)));
    };
    
    const findTipoServicio =(id)=>{
        const solicitante = tipoServicios.find((p)=>p.id === id);
        setEditTipoServicios(solicitante);
    };

    const updateTipoServicio =(tipoServicio)=>{
        tipoServicioService
        .update(tipoServicio)
        .then((data)=>
            setTipoServicios(
                tipoServicio.map((p)=>(p.id === tipoServicio.id ? data: tipoServicio))
            )
        );
        setEditTipoServicios(null);
    };
    return(
        <TipoServicioContext.Provider 
            value={{
                createTipoServicio,
                deleteTipoServicio,
                findTipoServicio,
                updateTipoServicio,
                editTipoServicios,
                tipoServicios,
            }}>
            {props.children}
        </TipoServicioContext.Provider>
    );
};
export default TipoServicioContextProvider;