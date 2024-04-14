import React, {createContext, useState, useEffect, useMemo } from "react";
import {ServicioService} from "../services/ServicioServices"
import {TipoServicioService} from "../services/tipoServiciosService"
import { GanadoService } from "../services/GanadoServices";

export const ServicioContext = createContext();

const ServicioContextProvider = (props)=>{
    const servicioService = useMemo(() => new ServicioService(), []);
    const tipoServicioService = useMemo(() => new TipoServicioService(), []);
    const ganadoService = useMemo(()=> new GanadoService(), []);
    
    const [servicios, setServicios] = useState([]);
    const [tipoServicios, setTipoServicios] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editServicio, setEditServicio] = useState(null);

    useEffect(() => {
        servicioService.readAll().then((data) => setServicios(data));
        tipoServicioService.readAll().then((data) => setTipoServicios(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [servicioService, servicios, tipoServicioService, tipoServicios, ganadoService, ganados]);

    const createServicio =(servicio)=>{
        servicioService
            .create(servicio)
            .then((data)=>setServicios([...servicios, data]));
    };

    const deleteServicio =(servicio)=>{
        servicioService
            .delete(servicio)
            .then(()=>setServicios(servicios.filter((p)=>p.id !== servicio.id)));
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
                tipoServicios,
                ganados
            }}>
            {props.children}
        </ServicioContext.Provider>
    );
};
export default ServicioContextProvider;