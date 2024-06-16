import React, {createContext, useState, useEffect, useMemo } from "react";
import {LecheService} from "../services/LecheServices"
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
    }, [lecheService, leches, ganadoService, ganados]);

    const createLeche =(leche)=>{
        lecheService
            .create(leche)
            .then((data)=>setLeches([...leches, data]));
    };

    const deleteLeche =(leche)=>{
        lecheService
            .delete(leche)
            .then(()=>setLeches(leches.filter((p)=>p.id !== leche.id)));
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
