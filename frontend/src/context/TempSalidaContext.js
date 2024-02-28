import React, {createContext, useState, useEffect, useMemo } from "react";
import {TempSalidaService} from "../services/TempSalidaServices"
import {GanadoService} from "../services/GanadoServices"

export const TempSalidaContext = createContext();

const TempSalidaContextProvider = (props)=>{
    const salidaService = useMemo(() => new TempSalidaService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [tempSalidas, setTempSalidas] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editTempSalida, setEditTempSalida] = useState(null);

    useEffect(() => {
        salidaService.readAll().then((data) => setTempSalidas(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [salidaService, tempSalidas, ganadoService, ganados]);

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

    //Aprovar Salida
    const aprobarSalida =(id)=>{
        salidaService
            .aprobar(id)
            .then(()=>setTempSalidas(tempSalidas.filter((p)=>p.id !== id)));
    };

    return(
        <TempSalidaContext.Provider 
            value={{
                createTempSalida,
                deleteTempSalida,
                findTempSalida,
                updateTempSalida,
                editTempSalida,
                tempSalidas,
                ganados,
                aprobarSalida
            }}>
            {props.children}
        </TempSalidaContext.Provider>
    );
};
export default TempSalidaContextProvider;