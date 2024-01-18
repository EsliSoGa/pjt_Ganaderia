import React, {useContext, useState, useEffect, useRef} from "react";
import { GanadoContext } from "../../context/GanadoContext";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import { Dropdown } from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import moment from "moment";

const Form =(props) =>{
    const {isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createGanado,
        deleteGanado,
        editGanados,
        updateGanado
    } = useContext(GanadoContext);

    const inicialGanadosState ={
        id:null,
        nombre_ganado:"",
        numero_ganado:"",
        sexo:"",
        peso:"",
        fecha_nacimiento_vaca:"",
        tipo:"",
        finca:"",
        estado:0,
        imagen:"",
        comentarios:"",
        id_usuario:1
    };

    const generos = [
        {label: 'Masculino', value: "Masculino"},
        {label: "Femenino", value: "Femenino"}
    ];

    const [ganadoData, setGanadoData] = useState(inicialGanadosState);

    useEffect(() => {
        if (editGanados) setGanadoData(editGanados);
    }, [editGanados]);

    const updateField = (data, field) =>{
        setGanadoData({
            ...ganadoData,
            [field]:data
        })
        console.log(ganadoData);
    };

    const saveGanado = () => {
        if(ganadoData.numero_ganado==="" || ganadoData.nombre_ganado===""){
            showInfo();
        }
        else{
            if (!editGanados) {
                ganadoData.fecha_nacimiento_vaca = moment(ganadoData.fecha_nacimiento_vaca).format("YYYY-MM-DD");
                createGanado(ganadoData);
            } else {
                ganadoData.fecha_nacimiento_vaca = moment(ganadoData.fecha_nacimiento_vaca).format("YYYY-MM-DD");
                updateGanado(ganadoData);
            }
            retornar();
        }
    };

    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const toast = useRef(null);

    const _deleteGanado = () => {
        if (editGanados) {
            deleteGanado(ganadoData.id);
            showError();
        }
        retornar();
    };

    const retornar =()=>{
        setGanadoData(inicialGanadosState);
        setIsVisible(false);
    };

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Eliminado', detail:'Se ha eliminado con éxito', life: 3000});
    }

    const dialogFooter=(
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteGanado} reject={retornar} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveGanado}/>
        </div>
    );

    const clearSelected = () => {
        setIsVisible(false);
        setGanadoData(inicialGanadosState);
    };

    return(<div>
        <Toast ref={toast}></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"420px", overflow:"scroll"}}
            contentStyle={{overflow:"visible"}}
            header = "Detalle de ganado"
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.nombre_ganado}
                        onChange={(e)=>updateField(e.target.value, "nombre_ganado")}
                    />
                    <label>Nombre*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.numero_ganado}
                        onChange={(e)=>updateField(e.target.value, "numero_ganado")}
                    />
                    <label>Número*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <Dropdown value={ganadoData.sexo} options={generos} onChange={(e) => updateField(e.target.value, "sexo")} placeholder="Seleccione un genero"/>
                    <label>Sexo</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.color}
                        onChange={(e)=>updateField(e.target.value, "color")}
                    />
                    <label>Color*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.peso}
                        onChange={(e)=>updateField(e.target.value, "peso")}
                    />
                    <label>Peso*</label>
                </div>
                <br />
                <div className="p-float-label">
                    <Calendar
                        value={ganadoData.fecha_nacimiento_vaca}
                        onChange={(e) => updateField( e.target.value, "fecha_nacimiento_vaca")}
                        dateFormat="dd-mm-yy"
                    />
                    <label>Fecha de nacimiento*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.tipo}
                        onChange={(e)=>updateField(e.target.value, "tipo")}
                    />
                    <label>Tipo*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.finca}
                        onChange={(e)=>updateField(e.target.value, "finca")}
                    />
                    <label>Finca*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputNumber
                        value={ganadoData.estado}
                        onChange={(e)=>updateField(e.value, "estado")}
                        locale="en-US"
                    />
                    <label>Estado*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.imagen}
                        onChange={(e)=>updateField(e.target.value, "imagen")}
                    />
                    <label>Imagen*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.comentarios}
                        onChange={(e)=>updateField(e.target.value, "comentarios")}
                    />
                    <label>Comentarios*</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default Form;