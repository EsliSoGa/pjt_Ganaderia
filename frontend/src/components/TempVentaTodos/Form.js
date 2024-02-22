import React, {useContext, useState, useEffect, useRef} from "react";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from 'primereact/dropdown';
import moment from "moment";

import { TempVentaContext } from "../../context/TempVentaContext";

const TempVentaForm =(props) =>{
    const {isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [isVisibleBtnAprobado, setIsVisibleBtnAprobado] = useState(false);
    const [isVisibleMsgAprobado, setisVisibleMsgAprobado] = useState(false);

    const {
        createTempVenta,
        deleteTempVenta,
        editTempVenta,
        updateTempVenta,
        ganados
    } = useContext(TempVentaContext);

    const inicialTempVentasState ={
        id:null,
        Fecha:"",
        Comprador:"",
        Precio:"",
        Peso: "", 
        Total:"",
        Id_ganado:""
    };

    const [tempVentaData, setTempVentaData] = useState(inicialTempVentasState);

    useEffect(() => {
        if (editTempVenta) {
            setTempVentaData(editTempVenta);
            setIsVisibleBtnAprobado(true);
        }
    }, [editTempVenta]);

    const updateField = (data, field) =>{
        setTempVentaData({
            ...tempVentaData,
            [field]:data
        })
    };

    const clearSelected = () => {
        setIsVisible(false);
        setTempVentaData(inicialTempVentasState);
        setIsVisibleBtnAprobado(false);
    };

    const saveTempVenta = () => {
        if(tempVentaData.Fecha==="" || tempVentaData.Comprador=== "" || tempVentaData.Peso === ""){
            showInfo();
        }
        else{
            tempVentaData.Fecha = moment(tempVentaData.Fecha).format("YYYY-MM-DD");
            if (!editTempVenta) {
                createTempVenta(tempVentaData);
            } else {
                updateTempVenta(tempVentaData);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    //Eliminar
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Eliminado', detail:'Se ha eliminado con éxito', life: 3000});
    }

    const _deleteTempVenta = () => {
        if (editTempVenta) {
            deleteTempVenta(tempVentaData.id);
            showError();
        }
        clearSelected();
    };

    const dialogFooter=(
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteTempVenta} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveTempVenta}/>
        </div>
    );
    
    //Aprobar
    const estadoTemplate = () => {
        return <div className="ui-dialog-buttonpane p-clearfix">
            <p>{"Detalle de venta"}</p>
            {buttons}
        </div>
    }
    const showAprobado = () => {
        toast.current.show({severity:'success', summary: 'Aprobado', detail:'Se ha aprobado con éxito', life: 3000});
    }

    const _aprobarVenta =()=>{
        if(editTempVenta){
            //cod aprobar
            showAprobado();
        }
        clearSelected();
    }

    
    const buttons = (
        <div className="card flex justify-content-center">
            <ConfirmDialog visible={isVisibleMsgAprobado} onHide={() => setisVisibleMsgAprobado(false)} message="¿Está seguro de aprobar?"
                header="Confirmación de aprobación" icon="pi pi-info-circle" accept={_aprobarVenta} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-danger" 
                icon="pi pi-check" label="Aprobar venta" visible={isVisibleBtnAprobado}
                onClick={() => setisVisibleMsgAprobado(true)}/>
        </div>
    );

    return(<div>
        <Toast ref={toast} position="top-center"></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"420px"}}
            contentStyle={{overflow:"visible"}}
            header = {estadoTemplate}
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <div className="p-float-label">
                    <Dropdown value={tempVentaData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id" 
                        onChange={(e) => updateField(e.target.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado"/>
                    <label>Ganado*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <Calendar
                        value={tempVentaData.Fecha && new Date(tempVentaData.Fecha)}
                        onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                        dateFormat="dd-mm-yy"
                    />
                    <label>Fecha</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={tempVentaData.Comprador}
                        onChange={(e)=>updateField(e.target.value, "Comprador")}
                    />
                    <label>Comprador*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputNumber
                        value={tempVentaData.Precio}
                        onChange={(e)=>updateField(e.value, "Precio")}
                        mode="decimal" locale="en-US" minFractionDigits={2}
                    />
                    <label>Precio*</label>
                </div><br />
                <div className="p-float-label">
                    <InputText
                        value={tempVentaData.Peso}
                        onChange={(e)=>updateField(e.target.value, "Peso")}
                    />
                    <label>Peso*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputNumber
                        value={tempVentaData.Total}
                        onChange={(e)=>updateField(e.value, "Total")}
                        mode="decimal" locale="en-US" minFractionDigits={2}
                    />
                    <label>Total*</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default TempVentaForm;