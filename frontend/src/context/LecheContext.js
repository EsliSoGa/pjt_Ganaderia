import React, {createContext, useState, useEffect, useMemo } from "react";
import {LecheService} from "../services/LecheService"
import {GanadoService} from "../services/GanadoServices"

export const LecheContext = createContext();

const LecheContextProvider = (props)=>{
    const lecheService = useMemo(() => new LecheService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [leches, setLeches] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editLeche, setEditLeche] = useState(null);

    useEffect(() => {
        lecheService.readAll().then((data) => setLeches(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [lecheService, ganadoService]);

    const createLeche =(leche)=>{
        lecheService
            .create(leche)
            .then((data)=>setLeches([...leches, data]));
    };

    const deleteLeche =(id)=>{
        lecheService
            .delete(id)
            .then(()=>setLeches(leches.filter((p)=>p.id !== id)));
    };
    
    const findLeche =(id)=>{
        const leche = leches.find((p)=>p.id === id);
        setEditLeche(leche);
    };

    const updateLeche =(leche)=>{
        lecheService
        .update(leche)
        .then((data)=>
            setLeches(
                leches.map((p)=>(p.id === leche.id ? data: leche))
            )
        );
        setEditLeche(null);
    };

    return(
        <LecheContext.Provider 
            value={{
                createLeche,
                deleteLeche,
                findLeche,
                updateLeche,
                editLeche,
                leches,
                ganados
            }}>
            {props.children}
        </LecheContext.Provider>
    );
};
export default LecheContextProvider;
