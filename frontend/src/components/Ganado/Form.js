import React, {useContext, useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { GanadoContext } from "../../context/GanadoContext";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import moment from "moment";
import FormPadres from "./Padres";


const Form =(props) =>{
    const {isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [isVisibleButton, setIsVisibleButton] = useState(false);
    const [isVisibleButtonPadres, setIsVisibleButtonPadres] = useState(false);

    const {
        createGanado,
        deleteGanado,
        editGanados,
        updateGanado,
        findPadre,
        editPadres
    } = useContext(GanadoContext);

    const inicialGanadosState ={
        id:null,
        nombre:"",
        numero:"",
        sexo:"",
        peso:"",
        fecha:"",
        tipo:"",
        finca:"",
        estado:1,
        imagen:"",
        comentarios:"",
        id_usuario:1
    };

    const estados = [
        {label: 'Activo', value: 1},
        {label: 'Inactivo', value: 0}
    ];

    const generos = [
        {label: 'Masculino', value: "Masculino"},
        {label: "Femenino", value: "Femenino"}
    ];

    const estadoTemplate = () => {
        return <div className="ui-dialog-buttonpane p-clearfix">
            <p>{"Detalle de ganado  "+ganadoData.numero}</p>
            {buttons}
        </div>
    }

    const [ganadoData, setGanadoData] = useState(inicialGanadosState);

    useEffect(() => {
        if (editGanados) {
            setGanadoData(editGanados);
            setIsVisibleButton(true);
        }
    }, [editGanados]);

    const updateField = (data, field) =>{
        setGanadoData({
            ...ganadoData,
            [field]:data
        })
        //console.log(ganadoData);
    };

    const clearSelected = () => {
        setIsVisible(false);
        setGanadoData(inicialGanadosState);
        setIsVisibleButton(false);
    };

    const saveGanado = () => {
        if(ganadoData.numero==="" || ganadoData.nombre===""){
            showInfo();
        }
        else{
            if (!editGanados) {
                ganadoData.fecha = moment(ganadoData.fecha).format("YYYY-MM-DD");
                createGanado(ganadoData);
            } else {
                ganadoData.fecha = moment(ganadoData.fecha).format("YYYY-MM-DD");
                updateGanado(ganadoData);
            }
            clearSelected();
        }
    };

    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Mensaje', detail:'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const toast = useRef(null);

    const _deleteGanado = () => {
        if (editGanados) {
            deleteGanado(ganadoData);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteGanado} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-trash" label="Eliminar" visible={isVisibleButton}
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-save"
                onClick={saveGanado}/>
        </div>
    );


    //Navegacion
    const navigate = useNavigate();
    function linkServicio (){
        navigate(`/servicio/${ganadoData.id}`)
    }
    function linkTraslado (){
        navigate(`/traslado/${ganadoData.id}`)
    }
    function linkTempVenta (){
        navigate(`/tventa/${ganadoData.id}`)
    }
    function linkTempSalida (){
        navigate(`/tsalida/${ganadoData.id}`)
    }
    //Formulario padres
    const padresForm=()=>{
        findPadre(ganadoData.id);
        console.log(editPadres);
        setIsVisibleButtonPadres(true)
    };


    const buttons = (
        <div className="ui-dialog-buttonpane p-clearfix">
            <span className="p-buttonset">
                <Button className="p-button-rounded mb-3 p-button-info" 
                    icon="pi pi-times" label="Traslado" visible={isVisibleButton}
                    onClick={linkTraslado}/> 
                <Button className="p-button-rounded mb-3 p-button-success"
                    label="Venta" icon="pi pi-tag" visible={isVisibleButton}
                    onClick={linkTempVenta}/>
                <Button className="p-button-raised p-button-rounded mb-3 p-button-help"
                    label="Servicio" icon="pi pi-check" visible={isVisibleButton}
                    onClick={linkServicio}/>
                <Button className="p-button-raised p-button-rounded mb-3 p-button-danger"
                    label="Salida" icon="pi pi-sign-out" visible={isVisibleButton}
                    onClick={linkTempSalida}/>
            </span>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-secondary"
                label="Padres" icon="pi pi-check" visible={isVisibleButton}
                onClick={padresForm}/>
        </div>
    );

    return(<div>
        <Toast ref={toast} position="top-center"></Toast>
        <Dialog
            visible={isVisible}
            modal={true}
            style={{width:"550px", overflow:"scroll"}}
            contentStyle={{overflow:"visible"}}
            header = {estadoTemplate}
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className=" p-grid p-fluid">
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.nombre}
                        onChange={(e)=>updateField(e.target.value, "nombre")}
                    />
                    <label>Nombre*</label>
                </div>
                <br/>
                <div className="p-float-label">
                    <InputText
                        value={ganadoData.numero}
                        onChange={(e)=>updateField(e.target.value, "numero")}
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
                        value={ganadoData.fecha && new Date(ganadoData.fecha)}
                        onChange={(e) => updateField(e.target.value.toISOString(), "fecha")}
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
                <br />
                <div className="p-float-label">
                    <Dropdown value={ganadoData.estado} options={estados} onChange={(e) => updateField(e.target.value, "estado")} placeholder="Seleccione un estado"/>
                    <label>Estado</label>
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
                    <label>Comentarios</label>
                </div>
            </div>
        </Dialog>
        <FormPadres idH={ganadoData.id} isVisibleButtonPadres = {isVisibleButtonPadres} setIsVisibleButtonPadres={setIsVisibleButtonPadres}/>
    </div>);
}

export default Form;