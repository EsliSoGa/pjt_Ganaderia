import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import DatePicker from 'react-datepicker'; // Importar DatePicker desde react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importar estilos CSS de react-datepicker
import { Dropdown } from 'primereact/dropdown';
import moment from "moment";

import { SalidaContext } from "../../context/SalidaContext";

const SalidaForm = (props) => {
    const { isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createSalida,
        deleteSalida,
        editSalida,
        updateSalida,
        ganados
    } = useContext(SalidaContext);

    const inicialSalidasState = {
        id: null,
        Fecha: null, // Cambiar a null para que coincida con el tipo de DatePicker
        Motivo: "",
        Imagen: "",
        Comentarios: "",
        Id_ganado: "",
        Nombre: "",
        Numero: "",
        id_usuario: 2
    };

    const [salidaData, setSalidaData] = useState(inicialSalidasState);

    useEffect(() => {
        if (editSalida) {
            setSalidaData({
                ...editSalida,
                Fecha: editSalida.Fecha ? new Date(editSalida.Fecha) : null // Formatear la fecha correctamente
            });
        }
    }, [editSalida]);

    const updateField = (data, field) => {
        setSalidaData({
            ...salidaData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setSalidaData(inicialSalidasState);
    };

    const saveSalida = () => {
        if (salidaData.Fecha === null || salidaData.Motivo === "" || salidaData.Comentarios === "") {
            showInfo();
        } else {
            const formattedDate = salidaData.Fecha ? moment(salidaData.Fecha).format("YYYY-MM-DD") : null;
            const salidaDataWithFormattedDate = {
                ...salidaData,
                Fecha: formattedDate,
            };

            if (!editSalida) {
                const ganado = ganados.find((p) => p.id === parseInt(salidaData.Id_ganado));
                salidaDataWithFormattedDate.Nombre = ganado.nombre;
                salidaDataWithFormattedDate.Numero = ganado.numero;
                createSalida(salidaDataWithFormattedDate);
            } else {
                salidaDataWithFormattedDate.id_usuario = 2;
                updateSalida(salidaDataWithFormattedDate);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteSalida = () => {
        if (editSalida) {
            salidaData.id_usuario = 2;
            deleteSalida(salidaData);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteSalida} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)} />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveSalida} />
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
                header="Detalle de salida"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Ganado*</label>
                        <Dropdown value={salidaData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id"
                            onChange={(e) => updateField(e.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <DatePicker
                            selected={salidaData.Fecha}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
                            className="p-inputtext p-component"
                            placeholderText="Seleccione una fecha"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Motivo*</label>
                        <InputText
                            value={salidaData.Motivo}
                            onChange={(e) => updateField(e.target.value, "Motivo")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Imagen*</label>
                        <InputText
                            value={salidaData.Imagen}
                            onChange={(e) => updateField(e.target.value, "Imagen")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comentarios*</label>
                        <InputText
                            value={salidaData.Comentarios}
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

export default SalidaForm;
