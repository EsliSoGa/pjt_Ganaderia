import React, {useContext, useState, useEffect, useRef} from "react";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';
import moment from "moment";

import { SalidaContext } from "../../context/SalidaContext";

const SalidaForm =(props) =>{
    const {isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createSalida,
        deleteSalida,
        editSalida,
        updateSalida,
        ganados
    } = useContext(SalidaContext);

    const inicialSalidasState ={
        id:null,
        Fecha:"",
        Motivo:"",
        Imagen:"",
        Comentarios: "",
        Id_ganado:""
    };

    const [salidaData, setSalidaData] = useState(inicialSalidasState);

    useEffect(() => {
        if (editSalida) setSalidaData(editSalida);
    }, [editSalida]);

    const updateField = (data, field) =>{
        setSalidaData({
            ...salidaData,
            [field]:data
        })
    };

    const clearSelected = () => {
        setIsVisible(false);
        setSalidaData(inicialSalidasState);
    };

    const saveSalida = () => {
        if(salidaData.Fecha==="" || salidaData.Motivo=== "" || salidaData.Comentarios === ""){
            showInfo();
        }
        else{
            salidaData.Fecha = moment(salidaData.Fecha).format("YYYY-MM-DD");
            if (!editSalida) {
                createSalida(salidaData);
            } else {
                updateSalida(salidaData);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const _deleteSalida = () => {
        if (editSalida) {
            deleteSalida(salidaData.id);
            showError();
        }
        clearSelected();
    };

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Eliminado', detail:'Se ha eliminado con éxito', life: 3000});
    }

    const dialogFooter=(
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteSalida} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveSalida}/>
        </div>
    );

    return(<div>
        <Toast ref={toast} position="top-center"></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"420px"}}
            contentStyle={{overflow:"visible"}}
            header = "Detalle de salida"
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <div className="p-float-label">
                    <Dropdown value={salidaData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id" 
                        onChange={(e) => updateField(e.target.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado"/>
                    <label>Ganado*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <Calendar
                        value={salidaData.Fecha && new Date(salidaData.Fecha)}
                        onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                        dateFormat="dd-mm-yy"
                    />
                    <label>Fecha*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={salidaData.Motivo}
                        onChange={(e)=>updateField(e.target.value, "Motivo")}
                    />
                    <label>Motivo*</label>
                </div>
                <br />
                <div className="p-float-label"> 
                    <InputText
                        value={salidaData.Imagen}
                        onChange={(e)=>updateField(e.target.value, "Imagen")}
                    />
                    <label>Imagen*</label>
                </div><br />
                <div className="p-float-label">
                    <InputText
                        value={salidaData.Comentarios}
                        onChange={(e)=>updateField(e.target.value, "Comentarios")}
                    />
                    <label>Comentarios*</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default SalidaForm;