import React, {createContext, useState, useEffect, useMemo } from "react";
import {VentaService} from "../services/VentaServices"
import {GanadoService} from "../services/GanadoServices"

export const VentaContext = createContext();

const VentaContextProvider = (props)=>{
    const ventaService = useMemo(() => new VentaService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [ventas, setVentas] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editVenta, setEditVenta] = useState(null);

    useEffect(() => {
        ventaService.readAll().then((data) => setVentas(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [ventaService, ventas, ganadoService, ganados]);

    const createVenta =(venta)=>{
        ventaService
            .create(venta)
            .then((data)=>setVentas([...ventas, data]));
    };

    const deleteVenta =(id)=>{
        ventaService
            .delete(id)
            .then(()=>setVentas(ventas.filter((p)=>p.id !== id)));
    };
    
    const findVenta =(id)=>{
        const venta = ventas.find((p)=>p.id === id);
        setEditVenta(venta);
    };

    const updateVenta =(venta)=>{
        ventaService
        .update(venta)
        .then((data)=>
            setVentas(
                ventas.map((p)=>(p.id === venta.id ? data: venta))
            )
        );
        setEditVenta(null);
    };
    return(
        <VentaContext.Provider 
            value={{
                createVenta,
                deleteVenta,
                findVenta,
                updateVenta,
                editVenta,
                ventas,
                ganados
            }}>
            {props.children}
        </VentaContext.Provider>
    );
};
export default VentaContextProvider;