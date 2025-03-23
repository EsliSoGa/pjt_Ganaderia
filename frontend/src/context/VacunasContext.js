import React, { createContext, useState, useEffect, useMemo } from "react";
import { VacunasService } from "../services/VacunasServices";
import { GanadoService } from "../services/GanadoServices";

export const VacunasContext = createContext();

const VacunasContextProvider = (props) => {
    const vacunasService = useMemo(() => new VacunasService(), []);
    const ganadoService = useMemo(() => new GanadoService(), []);
    
    const [vacunas, setVacunas] = useState([]);
    const [ganados, setGanados] = useState([]);

    const [editVacuna, setEditVacuna] = useState(null);

    useEffect(() => {
        vacunasService.readAll().then((data) => setVacunas(data));
        ganadoService.readAll().then((data) => setGanados(data));
    }, [vacunasService, vacunas, ganadoService, ganados]);

    const createVacuna = (vacuna) => {
        vacunasService
            .create(vacuna)
            .then((data) => setVacunas([...vacunas, data]));
    };

    const deleteVacuna = (vacuna) => {
        vacunasService
            .delete(vacuna)
            .then(() => setVacunas(vacunas.filter((p) => p.id !== vacuna.id)));
    };
    
    const findVacuna = (id) => {
        const vacuna = vacunas.find((p) => p.id === id);
        setEditVacuna(vacuna);
    };

    const updateVacuna = (vacuna) => {
        vacunasService
        .update(vacuna)
        .then((data) =>
            setVacunas(
                vacunas.map((p) => (p.id === vacuna.id ? data : vacuna))
            )
        );
        setEditVacuna(null);
    };
    return(
        <VacunasContext.Provider 
            value={{
                createVacuna,
                deleteVacuna,
                findVacuna,
                updateVacuna,
                editVacuna,
                vacunas,
                ganados
            }}>
            {props.children}
        </VacunasContext.Provider>
    );
};
export default VacunasContextProvider;
