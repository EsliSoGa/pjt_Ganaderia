import React, {createContext, useState, useEffect, useMemo } from "react";
import {BitacoraService} from "../services/BitacoraServices"

export const BitacoraContext = createContext();

const BitacoraContextProvider = (props)=>{
    const bitacoraService = useMemo(() => new BitacoraService(), []);
    
    const [bitacoras, setBitacoras] = useState([]);

    useEffect(() => {
        bitacoraService.readAll().then((data) => setBitacoras(data));
    }, [bitacoraService]);

    return(
        <BitacoraContext.Provider 
            value={{
                bitacoras
            }}>
            {props.children}
        </BitacoraContext.Provider>
    );
};
export default BitacoraContextProvider;