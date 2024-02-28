import React, {useContext, useState, useEffect, useRef} from "react";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import {InputText} from "primereact/inputtext";
import { Button } from "primereact/button";
import { GanadoContext } from "../../context/GanadoContext";
import { Dropdown } from 'primereact/dropdown';

const FormPadres = (props) =>{
    const {idH, isVisibleButtonPadres, setIsVisibleButtonPadres} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    
    const {
        editGanados,
        createPadre,
        deletePadre,
        editPadres,
        ganados
    } = useContext(GanadoContext);

    const [ganadoData, setGanadoData] = useState([]);


    const inicialPadresState = {
        id:null,
        Id_ganado_hijo: idH,
        Id_ganado_madre: "",
        Tipo_nacimiento: "",
        Id_ganado_padre: "",
    };

    const [padreData, setPadreData] = useState(inicialPadresState);

    
    useEffect(() => {
        setGanadoData(editGanados);
        if (editPadres) setPadreData(editPadres);
    }, [editPadres, editGanados]);

    const updateField = (data, field) =>{
        setPadreData({
            ...padreData,
            [field]:data
        })
    };

    const toast = useRef(null);

    const savePadre = () => {
        padreData.Id_ganado_hijo = idH;
        createPadre(padreData);
        clearSelected();
    };

    const _deletePadre = () => {
        if (editPadres) {
            deletePadre(padreData.id);
            showError();
        }
        clearSelected();
    };
    
    const clearSelected = () => {
        setIsVisibleButtonPadres(false);
        setPadreData(inicialPadresState);
        setGanadoData([]);
    };

    const showError = () => {
        toast.current.show({severity:'error', summary: 'Eliminado', detail:'Se ha eliminado con éxito', life: 3000});
    }

    const dialogFooter=(
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deletePadre} reject={clearSelected} 
                acceptClassName="p-button-danger"
                />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-trash" label="Eliminar" visible={isVisibleButtonPadres}
                onClick={() => setisVisibleDelete(true)}/>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-save"
                onClick={savePadre}/>
        </div>
    );

    const estadoTemplate = () => {
        return <span >{"Ganado padres  "+ganadoData.numero}</span>;
    }

    return(<div>
        <Toast ref={toast} position="top-center"></Toast>
        <Dialog
            visible={isVisibleButtonPadres}
            modal={true}
            style={{width:"600px"}}
            contentStyle={{overflow:"visible"}}
            header = {estadoTemplate}
            onHide={()=>clearSelected()}
            footer={dialogFooter}
        >
            <div className="p-grid p-fluid">
                <div className="p-float-label">
                    <Dropdown value={padreData.Id_ganado_madre} options={ganados.filter((p)=>p.sexo === "Femenino")} optionLabel="numero" optionValue="id" 
                    onChange={(e) => updateField(e.target.value, "Id_ganado_madre")} filter showClear filterBy="numero" placeholder="Seleccione a la madre"/>
                  <label>Madre</label>
                </div>
                <br />
                <div className="p-float-label">
                    <Dropdown value={padreData.Id_ganado_padre} options={ganados.filter((p)=>p.sexo === "Masculino")} optionLabel="numero" optionValue="id" 
                    onChange={(e) => updateField(e.target.value, "Id_ganado_padre")} filter showClear filterBy="numero" placeholder="Seleccione al padre"/>
                    <label>Padre</label>
                </div>
                <br />
                <div className="p-float-label">
                    <InputText
                        value={padreData.Tipo_nacimiento}
                        onChange={(e)=>updateField(e.target.value, "Tipo_nacimiento")}
                    />
                    <label>Tipo nacimiento</label>
                </div>
            </div>
        </Dialog>
    </div>);
}

export default FormPadres;