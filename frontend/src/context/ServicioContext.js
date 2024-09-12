import React, { createContext, useState, useEffect, useMemo } from "react";
import { ServicioService } from "../services/ServicioServices";
import { TipoServicioService } from "../services/tipoServiciosService";
import { GanadoService } from "../services/GanadoServices";

export const ServicioContext = createContext();

const ServicioContextProvider = (props) => {
    const servicioService = useMemo(() => new ServicioService(), []);
    const tipoServicioService = useMemo(() => new TipoServicioService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);

    const [servicios, setServicios] = useState([]);
    const [tipoServicios, setTipoServicios] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editServicio, setEditServicio] = useState(null);

    // Carga inicial de datos al montar el componente
    useEffect(() => {
        servicioService.readAll().then((data) => setServicios(data));
        tipoServicioService.readAll().then((data) => setTipoServicios(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [servicioService, tipoServicioService, ganadoService]); // Solo incluir los servicios

    const createServicio = (servicio) => {
        servicioService
            .create(servicio)
            .then((data) => setServicios((prevServicios) => [...prevServicios, data]));
    };

    const deleteServicio = (servicio) => {
        servicioService
            .delete(servicio)
            .then(() => setServicios((prevServicios) => prevServicios.filter((p) => p.id !== servicio.id)));
    };

    const findServicio = (id) => {
        const servicio = servicios.find((p) => p.id === id);
        setEditServicio(servicio);
    };

    const updateServicio = (servicio) => {
        servicioService
            .update(servicio)
            .then((data) =>
                setServicios((prevServicios) =>
                    prevServicios.map((p) => (p.id === servicio.id ? data : p))
                )
            );
        setEditServicio(null);
    };

    return (
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
            }}
        >
            {props.children}
        </ServicioContext.Provider>
    );
};

export default ServicioContextProvider;
