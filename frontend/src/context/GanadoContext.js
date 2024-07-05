import React, {createContext, useState, useEffect, useMemo } from "react";
import {GanadoService} from "../services/GanadoServices"
import {PadreService} from "../services/PadreServices"

export const GanadoContext = createContext();

const GanadoContextProvider = (props)=>{
    const ganadoService = useMemo(() => new GanadoService(), []);
    const padreService = useMemo(() => new PadreService(), []);
    
    const [ganados, setGanados] = useState([]);

    const [editGanados, setEditGanados] = useState(null);

    const [padres, setPadres] = useState([]);

    const [editPadres, setEditPadres] = useState(null);

    const getGanado = () => {
        ganadoService.readAll().then((data) => setGanados(data));
        padreService.readAll().then((data) => setPadres(data));
    };

    const createGanado =(ganado)=>{
        ganadoService
            .create(ganado)
            .then((data)=>setGanados([...ganados, data]));
    };

    const deleteGanado =(ganado)=>{
        ganadoService
            .delete(ganado)
            .then(()=>setGanados(ganados.filter((p)=>p.id !== ganado.id)));
    };
    
    const findGanado =(id)=>{
        const ganado = ganados.find((p)=>p.id === id);
        setEditGanados(ganado);
    };
    
    const updateGanado =(ganado)=>{
        ganadoService
        .update(ganado)
        .then((data)=>
            setGanados(
                ganados.map((p)=>(p.id === ganado.id ? data: ganado))
            )
        );
        setEditGanados(null);
    };

    // Padre context
    const createPadre =(padre)=>{
        padreService
            .create(padre)
            .then((data)=>setPadres([...padres, data]));
        nullEditPadre();
    };

    const deletePadre =(id)=>{
        padreService
            .delete(id)
            .then(()=>setPadres(padres.filter((p)=>p.id !== id)));
        nullEditPadre();
    };
    
    const findPadre =(id)=>{
        padreService.readId(id).then((data) => setEditPadres(data));
    };

    const nullEditPadre =()=>{
        setEditPadres(null);
    }

    return(
        <GanadoContext.Provider 
            value={{
                getGanado,
                createGanado,
                deleteGanado,
                findGanado,
                updateGanado,
                editGanados,
                ganados,
                createPadre,
                deletePadre,
                findPadre,
                nullEditPadre,
                editPadres,
                padres,
            }}>
            {props.children}
        </GanadoContext.Provider>
    );
};
export default GanadoContextProvider;