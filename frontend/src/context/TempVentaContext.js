import React, {createContext, useState, useEffect, useMemo } from "react";
import {TempVentaService} from "../services/TempVentaServices"

export const TempVentaContext = createContext();

const TempVentaContextProvider = (props)=>{
    const ventaService = useMemo(() => new TempVentaService(), []);
    
    const [tempVentas, setTempVentas] = useState([]);

    const [editTempVenta, setEditTempVenta] = useState(null);

    useEffect(() => {
        ventaService.readAll().then((data) => setTempVentas(data));
    }, [ventaService, tempVentas]);

    const createTempVenta =(venta)=>{
        ventaService
            .create(venta)
            .then((data)=>setTempVentas([...tempVentas, data]));
    };

    const deleteTempVenta =(id)=>{
        ventaService
            .delete(id)
            .then(()=>setTempVentas(tempVentas.filter((p)=>p.id !== id)));
    };
    
    const findTempVenta =(id)=>{
        const venta = tempVentas.find((p)=>p.id === id);
        setEditTempVenta(venta);
    };

    const updateTempVenta =(venta)=>{
        ventaService
        .update(venta)
        .then((data)=>
            setTempVentas(
                tempVentas.map((p)=>(p.id === venta.id ? data: venta))
            )
        );
        setEditTempVenta(null);
    };
    return(
        <TempVentaContext.Provider 
            value={{
                createTempVenta,
                deleteTempVenta,
                findTempVenta,
                updateTempVenta,
                editTempVenta,
                tempVentas
            }}>
            {props.children}
        </TempVentaContext.Provider>
    );
};
export default TempVentaContextProvider;