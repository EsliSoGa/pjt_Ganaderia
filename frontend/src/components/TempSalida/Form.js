import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from 'axios';

import { TempSalidaContext } from "../../context/TempSalidaContext";

const TempSalidaForm = (props) => {
    const { idTS, isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [isVisibleButton, setIsVisibleButton] = useState(false);

    const {
        createTempSalida,
        deleteTempSalida,
        editTempSalida,
        updateTempSalida,
        ganados
    } = useContext(TempSalidaContext);

    const inicialTempSalidasState = {
        id: null,
        Fecha: "",
        Motivo: "",
        Imagen: "",
        Comentarios: "",
        Id_ganado: idTS,
        Numero: ""
    };

    const [tempSalidaData, setTempSalidaData] = useState(inicialTempSalidasState);
    const [imageFile, setImageFile] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        if (editTempSalida) {
            setTempSalidaData(editTempSalida);
            setIsVisibleButton(true);
        } else {
            const ganado = ganados.find((p) => p.id === parseInt(idTS));
            if (ganado) {
                setTempSalidaData((prevState) => ({
                    ...prevState,
                    Numero: ganado.numero
                }));
            }
        }
    }, [editTempSalida, ganados, idTS]);

    const updateField = (data, field) => {
        setTempSalidaData({
            ...tempSalidaData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setTempSalidaData(inicialTempSalidasState);
        setIsVisibleButton(false);
    };

    const saveTempSalida = async () => {
        if (tempSalidaData.Fecha === "" || tempSalidaData.Motivo === "" || tempSalidaData.Comentarios === "") {
            showInfo();
        } else {
            const formattedDate = tempSalidaData.Fecha ? moment(tempSalidaData.Fecha).format("YYYY-MM-DD") : null;
            const tempSalidaDataWithFormattedDate = {
                ...tempSalidaData,
                Fecha: formattedDate,
            };

            if (imageFile) {
                try {
                    const formData = new FormData();
                    formData.append('image', imageFile);

                    const response = await axios.post('http://localhost:8080/tmpsalida/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    tempSalidaDataWithFormattedDate.Imagen = response.data.filePath;
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir la imagen' });
                    return;
                }
            }

            if (!editTempSalida) {
                createTempSalida(tempSalidaDataWithFormattedDate);
            } else {
                tempSalidaDataWithFormattedDate.id_usuario = 2;
                updateTempSalida(tempSalidaDataWithFormattedDate);
            }
            clearSelected();
        }
    };

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteTempSalida = () => {
        if (editTempSalida) {
            tempSalidaData.id_usuario = 2;
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
                icon="pi pi-times" label="Eliminar"  visible={isVisibleButton}
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
                        <label>Ganado Número*</label>
                        <InputText
                            value={tempSalidaData.Numero}
                            disabled
                        />
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
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
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
