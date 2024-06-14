import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GanadoContext } from "../../context/GanadoContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import moment from "moment";
import FormPadres from "./Padres";

const Form = (props) => {
    const { isVisible, setIsVisible } = props;
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

    const inicialGanadosState = {
        id: null,
        nombre: "",
        numero: "",
        sexo: "",
        peso: "",
        fecha: "",
        tipo: "",
        finca: "",
        estado: 1,
        imagen: "",
        comentarios: "",
        id_usuario: 1
    };

    const estados = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    const generos = [
        { label: 'Masculino', value: "Masculino" },
        { label: "Femenino", value: "Femenino" }
    ];

    const estadoTemplate = () => {
        return <div className="ui-dialog-buttonpane p-clearfix">
            <p>{"Detalle de ganado  " + ganadoData.numero}</p>
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

    const updateField = (data, field) => {
        setGanadoData({
            ...ganadoData,
            [field]: data
        })
    };

    const clearSelected = () => {
        setIsVisible(false);
        setGanadoData(inicialGanadosState);
        setIsVisibleButton(false);
    };

    const saveGanado = () => {
        if (ganadoData.numero === "" || ganadoData.nombre === "") {
            showInfo();
        } else {
            ganadoData.fecha = moment(ganadoData.fecha).format("YYYY-MM-DD");
            if (!editGanados) {
                createGanado(ganadoData);
            } else {
                updateGanado(ganadoData);
            }
            clearSelected();
        }
    };

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
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
        toast.current.show({ severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000 });
    }

    const dialogFooter = (
        <div className="ui-dialog-buttonpane p-clearfix" style={styles.dialogFooter}>
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteGanado} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-danger"
                icon="pi pi-trash" label="Eliminar" visible={isVisibleButton}
                onClick={() => setisVisibleDelete(true)} />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-success"
                label="Guardar" icon="pi pi-save"
                onClick={saveGanado} />
        </div>
    );

    // Navegación
    const navigate = useNavigate();
    const linkServicio = () => navigate(`/servicio/${ganadoData.id}`);
    const linkTraslado = () => navigate(`/traslado/${ganadoData.id}`);
    const linkTempVenta = () => navigate(`/tventa/${ganadoData.id}`);
    const linkTempSalida = () => navigate(`/tsalida/${ganadoData.id}`);

    // Formulario padres
    const padresForm = () => {
        findPadre(ganadoData.id);
        setIsVisibleButtonPadres(true);
    };

    const buttons = (
        <div className="ui-dialog-buttonpane p-clearfix" style={styles.buttonPane}>
            <span className="p-buttonset" style={styles.buttonSet}>
                <Button className="p-button-rounded mb-3 p-button-info"
                    icon="pi pi-times" label="Traslado" visible={isVisibleButton}
                    onClick={linkTraslado} />
                <Button className="p-button-rounded mb-3 p-button-success"
                    label="Venta" icon="pi pi-tag" visible={isVisibleButton}
                    onClick={linkTempVenta} />
                <Button className="p-button-raised p-button-rounded mb-3 p-button-help"
                    label="Servicio" icon="pi pi-check" visible={isVisibleButton}
                    onClick={linkServicio} />
                <Button className="p-button-raised p-button-rounded mb-3 p-button-danger"
                    label="Salida" icon="pi pi-sign-out" visible={isVisibleButton}
                    onClick={linkTempSalida} />
                <Button className="p-button-raised p-button-rounded mb-3 p-button-secondary"
                    label="Padres" icon="pi pi-check" visible={isVisibleButton}
                    onClick={padresForm} />
            </span>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} position="top-center"></Toast>
            <Dialog
                visible={isVisible}
                modal={true}
                style={{ width: "550px", overflow: "scroll" }}
                contentStyle={{ overflow: "visible", padding: '20px' }}
                header={estadoTemplate}
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div className="p-grid p-fluid" style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Nombre*</label>
                        <InputText
                            value={ganadoData.nombre}
                            onChange={(e) => updateField(e.target.value, "nombre")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Número*</label>
                        <InputText
                            value={ganadoData.numero}
                            onChange={(e) => updateField(e.target.value, "numero")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Sexo</label>
                        <Dropdown value={ganadoData.sexo} options={generos} onChange={(e) => updateField(e.value, "sexo")} placeholder="Seleccione un género" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Color*</label>
                        <InputText
                            value={ganadoData.color}
                            onChange={(e) => updateField(e.target.value, "color")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Peso*</label>
                        <InputText
                            value={ganadoData.peso}
                            onChange={(e) => updateField(e.target.value, "peso")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha de nacimiento*</label>
                        <Calendar
                            value={ganadoData.fecha && new Date(ganadoData.fecha)}
                            onChange={(e) => updateField(e.value, "fecha")}
                            dateFormat="dd-mm-yy"
                            showIcon
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Tipo*</label>
                        <InputText
                            value={ganadoData.tipo}
                            onChange={(e) => updateField(e.target.value, "tipo")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Finca*</label>
                        <InputText
                            value={ganadoData.finca}
                            onChange={(e) => updateField(e.target.value, "finca")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Estado</label>
                        <Dropdown value={ganadoData.estado} options={estados} onChange={(e) => updateField(e.value, "estado")} placeholder="Seleccione un estado" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Imagen*</label>
                        <InputText
                            value={ganadoData.imagen}
                            onChange={(e) => updateField(e.target.value, "imagen")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comentarios</label>
                        <InputText
                            value={ganadoData.comentarios}
                            onChange={(e) => updateField(e.target.value, "comentarios")}
                        />
                    </div>
                </div>
            </Dialog>
            <FormPadres idH={ganadoData.id} isVisibleButtonPadres={isVisibleButtonPadres} setIsVisibleButtonPadres={setIsVisibleButtonPadres} />
        </div>
    );
}

const styles = {
    formGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formField: {
        marginBottom: '15px',
    },
    buttonPane: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
    },
    dialogFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
    }
};

export default Form;
