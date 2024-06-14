import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import moment from "moment";

import { TempSalidaContext } from "../../context/TempSalidaContext";

const TempSalidaForm = (props) => {
    const { idTS, isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createTempSalida,
        deleteTempSalida,
        editTempSalida,
        updateTempSalida
    } = useContext(TempSalidaContext);

    const inicialTempSalidasState = {
        id: null,
        Fecha: "",
        Motivo: "",
        Imagen: "",
        Comentarios: "",
        Id_ganado: idTS
    };

    const [tempSalidaData, setTempSalidaData] = useState(inicialTempSalidasState);

    useEffect(() => {
        if (editTempSalida) setTempSalidaData(editTempSalida);
    }, [editTempSalida]);

    const updateField = (data, field) => {
        setTempSalidaData({
            ...tempSalidaData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setTempSalidaData(inicialTempSalidasState);
    };

    const saveTempSalida = () => {
        if (tempSalidaData.Fecha === "" || tempSalidaData.Motivo === "" || tempSalidaData.Comentarios === "") {
            showInfo();
        } else {
            tempSalidaData.Fecha = moment(tempSalidaData.Fecha).format("YYYY-MM-DD");
            if (!editTempSalida) {
                createTempSalida(tempSalidaData);
            } else {
                updateTempSalida(tempSalidaData);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteTempSalida = () => {
        if (editTempSalida) {
            deleteTempSalida(tempSalidaData.id);
            showError();
        }
        clearSelected();
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000 });
    }

    const dialogFooter = (
        <div style={styles.dialogFooter}>
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteTempSalida} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)} />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveTempSalida} />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} position="top-center"></Toast>
            <Dialog
                visible={isVisible}
                modal={true}
                style={{ width: "550px" }}
                contentStyle={{ overflow: "visible" }}
                header="Detalles de salida"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <Calendar
                            value={tempSalidaData.Fecha && new Date(tempSalidaData.Fecha)}
                            onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                            dateFormat="dd-mm-yy"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Motivo*</label>
                        <InputText
                            value={tempSalidaData.Motivo}
                            onChange={(e) => updateField(e.target.value, "Motivo")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Imagen*</label>
                        <InputText
                            value={tempSalidaData.Imagen}
                            onChange={(e) => updateField(e.target.value, "Imagen")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comentarios*</label>
                        <InputText
                            value={tempSalidaData.Comentarios}
                            onChange={(e) => updateField(e.target.value, "Comentarios")}
                        />
                    </div>
                </div>
            </Dialog>
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
    dialogFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
    }
};

export default TempSalidaForm;
