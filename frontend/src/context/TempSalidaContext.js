import React, {createContext, useState, useEffect, useMemo } from "react";
import {TempSalidaService} from "../services/TempSalidaServices"

export const TempSalidaContext = createContext();

const TempSalidaContextProvider = (props)=>{
    const salidaService = useMemo(() => new TempSalidaService(), []);
    
    const [tempSalidas, setTempSalidas] = useState([]);

    const [editTempSalida, setEditTempSalida] = useState(null);

    useEffect(() => {
        salidaService.readAll().then((data) => setTempSalidas(data));
    }, [salidaService, tempSalidas]);

    const createTempSalida =(salida)=>{
        salidaService
            .create(salida)
            .then((data)=>setTempSalidas([...tempSalidas, data]));
    };

    const deleteTempSalida =(id)=>{
        salidaService
            .delete(id)
            .then(()=>setTempSalidas(tempSalidas.filter((p)=>p.id !== id)));
    };
    
    const findTempSalida =(id)=>{
        const salida = tempSalidas.find((p)=>p.id === id);
        setEditTempSalida(salida);
    };

    const updateTempSalida =(salida)=>{
        salidaService
        .update(salida)
        .then((data)=>
            setTempSalidas(
                tempSalidas.map((p)=>(p.id === salida.id ? data: salida))
            )
        );
        setEditTempSalida(null);
    };
    return(
        <TempSalidaContext.Provider 
            value={{
                createTempSalida,
                deleteTempSalida,
                findTempSalida,
                updateTempSalida,
                editTempSalida,
                tempSalidas
            }}>
            {props.children}
        </TempSalidaContext.Provider>
    );
};
export default TempSalidaContextProvider;