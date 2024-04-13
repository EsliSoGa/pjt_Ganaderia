import React, {useContext, useState, useEffect, useRef} from "react";
import { TrasladoContext } from "../../context/TrasladoContext";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";

import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import moment from "moment";

const TrasladoForm =(props) =>{
    const {idT, isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const [ganadoData, setGanadoData] = useState([]);

    const {
        createTraslado,
        deleteTraslado,
        editTraslado,
        updateTraslado, 
        ganados
    } = useContext(TrasladoContext);

    const inicialTrasladosState ={
        id:null,
        Id_ganado:idT,
        Fecha:"",
        Finca_origen:"",
        Finca_destino:"",
        Nombre: "",
        Numero: "", 
        id_usuario: 2
    };

    const [trasladoData, setTrasladoData] = useState(inicialTrasladosState);

    useEffect(() => {
        if (editTraslado) setTrasladoData(editTraslado);
    }, [editTraslado]);

    const updateField = (data, field) =>{
        setTrasladoData({
            ...trasladoData,
            [field]:data
        })
        //console.log(trasladoData);
    };

    const clearSelected = () => {
        setIsVisible(false);
        setTrasladoData(inicialTrasladosState);
    };

    const saveTraslado = () => {
        if(trasladoData.Finca_destino==="" || trasladoData.Finca_origen==="" || trasladoData.Fecha ===""){
            showInfo();
        }
        else{
            if (!editTraslado) {
                const ganado = ganados.find((p)=>p.id === parseInt(idT));
                setGanadoData(ganado);
                //console.log(ganadoData);
                trasladoData.Nombre = ganadoData.nombre;
                trasladoData.Numero = ganadoData.numero;
                trasladoData.Fecha = moment(trasladoData.Fecha).format("YYYY-MM-DD");
                //console.log(trasladoData);
                createTraslado(trasladoData);
            } else {
                trasladoData.id_usuario =2;
                trasladoData.Fecha = moment(trasladoData.Fecha).format("YYYY-MM-DD");
                updateTraslado(trasladoData);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);
    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const _deleteTraslado = () => {
        if (editTraslado) {
            trasladoData.id_usuario = 2;
            deleteTraslado(trasladoData);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteTraslado} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveTraslado}/>
        </div>
    );

    return(<div>
        <Toast ref={toast} position="top-center"></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"420px"}}
            contentStyle={{overflow:"visible"}}
            header = "Detalles de traslado"
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <br/>
                <div className="p-float-label">
                    <Calendar
                        value={trasladoData.Fecha && new Date(trasladoData.Fecha)}
                        onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                        dateFormat="dd-mm-yy"
                    />
                    <label>Fecha</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={trasladoData.Finca_origen}
                        onChange={(e)=>updateField(e.target.value, "Finca_origen")}
                    />
                    <label>Finca origen*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputText
                        value={trasladoData.Finca_destino}
                        onChange={(e)=>updateField(e.target.value, "Finca_destino")}
                    />
                    <label>Finca destino*</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default TrasladoForm;