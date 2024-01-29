import React, {createContext, useState, useEffect, useMemo } from "react";
import {ServicioService} from "../services/ServicioServices"
import {TipoServicioService} from "../services/tipoServiciosService"

export const ServicioContext = createContext();

const ServicioContextProvider = (props)=>{
    const servicioService = useMemo(() => new ServicioService(), []);
    const tipoServicioService = useMemo(() => new TipoServicioService(), []);
    
    const [servicios, setServicios] = useState([]);
    const [tipoServicios, setTipoServicios] = useState([]);

    const [editServicio, setEditServicio] = useState(null);

    useEffect(() => {
        servicioService.readAll().then((data) => setServicios(data));
        tipoServicioService.readAll().then((data) => setTipoServicios(data));
    }, [servicioService, servicios, tipoServicioService, tipoServicios]);

    const createServicio =(servicio)=>{
        servicioService
            .create(servicio)
            .then((data)=>setServicios([...servicios, data]));
    };

    const deleteServicio =(id)=>{
        servicioService
            .delete(id)
            .then(()=>setServicios(servicios.filter((p)=>p.id !== id)));
    };
    
    const findServicio =(id)=>{
        const servicio = servicios.find((p)=>p.id === id);
        setEditServicio(servicio);
    };

    const updateServicio =(servicio)=>{
        servicioService
        .update(servicio)
        .then((data)=>
            setServicios(
                servicios.map((p)=>(p.id === servicio.id ? data: servicio))
            )
        );
        setEditServicio(null);
    };
    return(
        <ServicioContext.Provider 
            value={{
                createServicio,
                deleteServicio,
                findServicio,
                updateServicio,
                editServicio,
                servicios,
                tipoServicios
            }}>
            {props.children}
        </ServicioContext.Provider>
    );
};
export default ServicioContextProvider;