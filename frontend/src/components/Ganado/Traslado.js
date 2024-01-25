import React, {useContext, useState, useEffect} from "react";
import { GanadoContext } from "../../context/GanadoContext";
import {Dialog} from "primereact/dialog";
/*import { Button } from "primereact/button";
import Form from './Form';*/

const FormButton =(props) =>{
    const {isVisibleButtonTraslado, setIsVisibleButtonTraslado} = props;
    
    const {editGanados} = useContext(GanadoContext);

    const [ganadoData, setGanadoData] = useState([]);
    
    useEffect(() => {
        if (editGanados) setGanadoData(editGanados);
    }, [editGanados]);
    
    const clearSelected = () => {
        setGanadoData([]);
        setIsVisibleButtonTraslado(false);
    };

    return(<div>
        <Dialog
            visible={isVisibleButtonTraslado}
            modal={true}
            style={{width:"600px", overflow:"scroll"}}
            contentStyle={{overflow:"visible"}}
            header = "Ganado"
            onHide={()=>clearSelected()}
        >
            <div className="p-grid p-fluid">
                <p>Número de ganado: {ganadoData.numero}</p>
                <br/>
            </div>
        </Dialog>
    </div>);
}

export default FormButton;