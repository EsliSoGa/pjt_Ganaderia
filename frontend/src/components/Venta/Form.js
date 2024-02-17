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

import { VentaContext } from "../../context/VentaContext";

const VentaForm =(props) =>{
    const {isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createVenta,
        deleteVenta,
        editVenta,
        updateVenta,
        ganados
    } = useContext(VentaContext);

    const inicialVentasState ={
        id:null,
        Fecha:"",
        Comprador:"",
        Precio:"",
        Peso: "", 
        Total:"",
        Id_ganado:""
    };

    const [ventaData, setVentaData] = useState(inicialVentasState);

    useEffect(() => {
        if (editVenta) setVentaData(editVenta);
    }, [editVenta]);

    const updateField = (data, field) =>{
        setVentaData({
            ...ventaData,
            [field]:data
        })
    };

    const clearSelected = () => {
        setIsVisible(false);
        setVentaData(inicialVentasState);
    };

    const saveVenta = () => {
        if(ventaData.Fecha==="" || ventaData.Comprador=== "" || ventaData.Peso === ""){
            showInfo();
        }
        else{
            ventaData.Fecha = moment(ventaData.Fecha).format("YYYY-MM-DD");
            if (!editVenta) {
                createVenta(ventaData);
            } else {
                updateVenta(ventaData);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const _deleteVenta = () => {
        if (editVenta) {
            deleteVenta(ventaData.id);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteVenta} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveVenta}/>
        </div>
    );

    return(<div>
        <Toast ref={toast}></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"420px"}}
            contentStyle={{overflow:"visible"}}
            header = "Detalles de Venta"
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <div className="p-float-label">
                    <Dropdown value={ventaData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id" 
                        onChange={(e) => updateField(e.target.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado"/>
                    <label>Ganado*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <Calendar
                        value={ventaData.Fecha && new Date(ventaData.Fecha)}
                        onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                        dateFormat="dd-mm-yy"
                    />
                    <label>Fecha</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ventaData.Comprador}
                        onChange={(e)=>updateField(e.target.value, "Comprador")}
                    />
                    <label>Comprador*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputNumber
                        value={ventaData.Precio}
                        onChange={(e)=>updateField(e.value, "Precio")}
                        mode="decimal" locale="en-US" minFractionDigits={2}
                    />
                    <label>Precio*</label>
                </div><br />
                <div className="p-float-label">
                    <InputText
                        value={ventaData.Peso}
                        onChange={(e)=>updateField(e.target.value, "Peso")}
                    />
                    <label>Peso*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputNumber
                        value={ventaData.Total}
                        onChange={(e)=>updateField(e.value, "Total")}
                        mode="decimal" locale="en-US" minFractionDigits={2}
                    />
                    <label>Total*</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default VentaForm;