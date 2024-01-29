import React, {useContext, useState, useEffect, useRef} from "react";
import { GanadoContext } from "../../context/GanadoContext";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";

const FormPadres = (props) =>{
    const {isVisibleButtonPadres, setIsVisibleButtonPadres} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    
    const {editGanados} = useContext(GanadoContext);

    const [ganadoData, setGanadoData] = useState([]);
    
    useEffect(() => {
        if (editGanados) setGanadoData(editGanados);
    }, [editGanados]);

    const toast = useRef(null);

    const saveGanado = () => {
        if(ganadoData.numero==="" || ganadoData.nombre===""){
            showInfo();
        }
        else{
            if (!editGanados) {
                /*ganadoData.fecha = moment(ganadoData.fecha).format("YYYY-MM-DD");
                createGanado(ganadoData);*/
            } else {
                /*ganadoData.fecha = moment(ganadoData.fecha).format("YYYY-MM-DD");
                updateGanado(ganadoData);*/
            }
            clearSelected();
        }
    };

    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const _deleteGanado = () => {
        if (editGanados) {
            //deleteGanado(ganadoData.id);
            showError();
        }
        clearSelected();
    };
    
    const clearSelected = () => {
        setIsVisibleButtonPadres(false);
    };

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Eliminado', detail:'Se ha eliminado con éxito', life: 3000});
    }

    const dialogFooter=(
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteGanado} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-trash" label="Eliminar" visible={isVisibleButtonPadres}
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-save"
                onClick={saveGanado}/>
        </div>
    );

    const estadoTemplate = () => {
        return <span >{"Ganado padres  "+ganadoData.numero}</span>;
    }

    return(<div>
        <Toast ref={toast}></Toast>
        <Dialog
            visible={isVisibleButtonPadres}
            modal={true}
            style={{width:"600px", overflow:"scroll"}}
            contentStyle={{overflow:"visible"}}
            header = {estadoTemplate}
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <p>Número de ganado: {ganadoData.numero}</p>
                <br/>
            </div>
        </Dialog>
    </div>);
}

export default FormPadres;