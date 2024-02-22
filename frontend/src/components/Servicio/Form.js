import React, {useContext, useState, useEffect, useRef} from "react";
import { ServicioContext } from "../../context/ServicioContext";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import moment from "moment";

const ServicioForm =(props) =>{
    const {idS, isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createServicio,
        deleteServicio,
        editServicio,
        updateServicio,
        tipoServicios
    } = useContext(ServicioContext);

    const inicialServiciosState ={
        id:null,
        Fecha:"",
        Condicion:"",
        Edad:"",
        comentario:"",
        id_ganado:idS,
        tipo_servicio:""
    };

    const [servicioData, setServicioData] = useState(inicialServiciosState);

    useEffect(() => {
        if (editServicio) setServicioData(editServicio);
    }, [editServicio]);

    const updateField = (data, field) =>{
        setServicioData({
            ...servicioData,
            [field]:data
        })
        //console.log(servicioData);
    };

    const saveServicio = () => {
        if(servicioData.nombre==="" || servicioData.descripcion===""){
            showInfo();
        }
        else{
        if (!editServicio) {
            servicioData.Fecha = moment(servicioData.Fecha).format("YYYY-MM-DD");
            createServicio(servicioData);
        } else {
            servicioData.Fecha = moment(servicioData.Fecha).format("YYYY-MM-DD");
            updateServicio(servicioData);
        }
        retornar();}
    };

    const toast = useRef(null);
    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const _deleteServicio = () => {
        if (editServicio) {
            deleteServicio(servicioData.id);
            showError();
        }
        retornar();
    };
    const retornar =()=>{
        setServicioData(inicialServiciosState);
        setIsVisible(false);
    };

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Eliminado', detail:'Se ha eliminado con éxito', life: 3000});
    }

    const dialogFooter=(
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteServicio} reject={retornar} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveServicio}/>
        </div>
    );

    const clearSelected = () => {
        setIsVisible(false);
        setServicioData(inicialServiciosState);
    };

    return(<div>
        <Toast ref={toast} position="top-center"></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"420px"}}
            contentStyle={{overflow:"visible"}}
            header = "Detalles de servicios"
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <br/>
                <div className="p-float-label">
                    <Calendar
                        value={servicioData.Fecha && new Date(servicioData.Fecha)}
                        onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                        dateFormat="dd-mm-yy"
                    />
                    <label>Fecha</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={servicioData.Condicion}
                        onChange={(e)=>updateField(e.target.value, "Condicion")}
                    />
                    <label>Condicion</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputNumber
                        value={servicioData.Edad}
                        onChange={(e)=>updateField(e.value, "Edad")}
                    />
                    <label>Edad</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputText
                        value={servicioData.comentario}
                        onChange={(e)=>updateField(e.target.value, "comentario")}
                    />
                    <label>Comentario</label>
                </div>
                <br />
                <div className="p-float-label">
                <Dropdown value={servicioData.id_tipo_servicio} options={tipoServicios} optionLabel="Nombre_tipo" optionValue="id" 
                    onChange={(e) => updateField(e.target.value, "id_tipo_servicio")} filter showClear filterBy="Nombre_tipo" placeholder="Seleccione un tipo"/>
                    <label>Tipo</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default ServicioForm;