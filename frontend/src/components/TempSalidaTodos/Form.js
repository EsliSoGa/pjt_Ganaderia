import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { TempSalidaContext } from "../../context/TempSalidaContext";

const TempSalidaForm = (props) => {
    const { isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [isVisibleBtnAprobado, setIsVisibleBtnAprobado] = useState(false);
    const [isVisibleMsgAprobado, setisVisibleMsgAprobado] = useState(false);

    const {
        createTempSalida,
        deleteTempSalida,
        editTempSalida,
        updateTempSalida,
        ganados,
        aprobarSalida
    } = useContext(TempSalidaContext);

    const inicialTempSalidasState = {
        id: null,
        Fecha: "",
        Motivo: "",
        Imagen: "",
        Comentarios: "",
        Id_ganado: "",
        id_usuario: 2
    };

    const [tempSalidaData, setTempSalidaData] = useState(inicialTempSalidasState);

    useEffect(() => {
        if (editTempSalida) {
            setTempSalidaData(editTempSalida);
            setIsVisibleBtnAprobado(true);
        }
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
        setIsVisibleBtnAprobado(false);
    };

    const saveTempSalida = () => {
        if (tempSalidaData.Fecha === "" || tempSalidaData.Motivo === "" || tempSalidaData.Comentarios === "") {
            showInfo();
        } else {
            const formattedDate = tempSalidaData.Fecha ? moment(tempSalidaData.Fecha).format("YYYY-MM-DD") : null;
            const tempSalidaDataWithFormattedDate = {
                ...tempSalidaData,
                Fecha: formattedDate,
            };

            if (!editTempSalida) {
                createTempSalida(tempSalidaDataWithFormattedDate);
            } else {
                updateTempSalida(tempSalidaDataWithFormattedDate);
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

    //Aprobar
    const estadoTemplate = () => {
        return <div style={styles.dialogHeader}>
            <p>{"Detalle de salida"}</p>
            {buttons}
        </div>
    }

    const showAprobado = () => {
        toast.current.show({ severity: 'success', summary: 'Aprobado', detail: 'Se ha aprobado con éxito', life: 3000 });
    }

    const _aprobarSalida = () => {
        if (editTempSalida) {
            tempSalidaData.id_usuario = 2;
            aprobarSalida(tempSalidaData);
            showAprobado();
        }
        clearSelected();
    }

    const buttons = (
        <div className="card flex justify-content-center">
            <ConfirmDialog visible={isVisibleMsgAprobado} onHide={() => setisVisibleMsgAprobado(false)} message="¿Está seguro de aprobar?"
                header="Confirmación de aprobación" icon="pi pi-info-circle" accept={_aprobarSalida} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-danger"
                icon="pi pi-check" label="Aprobar salida" visible={isVisibleBtnAprobado}
                onClick={() => setisVisibleMsgAprobado(true)} />
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
                header={estadoTemplate}
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Ganado*</label>
                        <Dropdown value={tempSalidaData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id"
                            onChange={(e) => updateField(e.target.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <DatePicker
                            selected={tempSalidaData.Fecha ? new Date(tempSalidaData.Fecha) : null}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
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
    },
    dialogHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
};

export default TempSalidaForm;
