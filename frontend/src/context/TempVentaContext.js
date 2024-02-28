import React, {createContext, useState, useEffect, useMemo } from "react";
import {TempVentaService} from "../services/TempVentaServices"
import {GanadoService} from "../services/GanadoServices"

export const TempVentaContext = createContext();

const TempVentaContextProvider = (props)=>{
    const ventaService = useMemo(() => new TempVentaService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [tempVentas, setTempVentas] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editTempVenta, setEditTempVenta] = useState(null);

    useEffect(() => {
        ventaService.readAll().then((data) => setTempVentas(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [ventaService, tempVentas, ganadoService, ganados]);

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

    //Aprovar Venta
    const aprobarVenta =(id)=>{
        ventaService
            .aprobar(id)
            .then(()=>setTempVentas(tempVentas.filter((p)=>p.id !== id)));
    };

    return(
        <TempVentaContext.Provider 
            value={{
                createTempVenta,
                deleteTempVenta,
                findTempVenta,
                updateTempVenta,
                editTempVenta,
                tempVentas,
                ganados,
                aprobarVenta
            }}>
            {props.children}
        </TempVentaContext.Provider>
    );
};
export default TempVentaContextProvider;