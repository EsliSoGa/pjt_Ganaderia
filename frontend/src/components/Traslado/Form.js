import React, { useContext, useState, useEffect, useRef } from "react";
import { TrasladoContext } from "../../context/TrasladoContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Dropdown } from 'primereact/dropdown'; // Asegúrate de importar Dropdown

const TrasladoForm = (props) => {
    const { idT, isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [isVisibleButton, setIsVisibleButton] = useState(false);
    const [ganadoData, setGanadoData] = useState({});
    const [trasladoData, setTrasladoData] = useState({
        id: null,
        Id_ganado: idT,
        Fecha: "",
        Finca_origen: "",
        Finca_destino: "",
        Nombre: "",
        Numero: "",
        id_usuario: 2
    });

    const { createTraslado, deleteTraslado, editTraslado, updateTraslado, ganados } = useContext(TrasladoContext);
    const toast = useRef(null);

    useEffect(() => {
        if (editTraslado) {
            setTrasladoData(editTraslado);
            setIsVisibleButton(true);
        } else {
            const ganado = ganados.find((p) => p.id === parseInt(idT));
            if (ganado) {
                setGanadoData(ganado);
                setTrasladoData((prevState) => ({
                    ...prevState,
                    Finca_origen: ganado.Finca,
                    Nombre: ganado.Nombre,
                    Numero: ganado.Numero
                }));
            }
        }
    }, [editTraslado, ganados, idT]);

    const updateField = (data, field) => {
        setTrasladoData((prevState) => ({
            ...prevState,
            [field]: data
        }));
    };

    const clearSelected = () => {
        setIsVisible(false);
        setIsVisibleButton(false);
        setTrasladoData({
            id: null,
            Id_ganado: idT,
            Fecha: "",
            Finca_origen: "",
            Finca_destino: "",
            Nombre: "",
            Numero: "",
            id_usuario: 2
        });
    };

    const saveTraslado = () => {
        if (trasladoData.Finca_destino === "" || trasladoData.Finca_origen === "" || trasladoData.Fecha === "") {
            showInfo();
        } else {
            trasladoData.Fecha = moment(trasladoData.Fecha).format("YYYY-MM-DD");
            if (!editTraslado) {
                createTraslado(trasladoData);
            } else {
                trasladoData.id_usuario = 2;
                updateTraslado(trasladoData);
            }
            clearSelected();
        }
    };

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    };

    const _deleteTraslado = () => {
        if (editTraslado) {
            trasladoData.id_usuario = 2;
            deleteTraslado(trasladoData);
            showError();
        }
        clearSelected();
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000 });
    };

    const dialogFooter = (
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog
                visible={isVisibleDelete}
                onHide={() => setisVisibleDelete(false)}
                message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación"
                icon="pi pi-info-circle"
                accept={_deleteTraslado}
                reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button
                className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times"
                label="Eliminar"
                visible={isVisibleButton}
                onClick={() => setisVisibleDelete(true)}
            />
            <Button
                className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar"
                icon="pi pi-check"
                onClick={saveTraslado}
            />
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
                header="Detalles de traslado"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <DatePicker
                            selected={trasladoData.Fecha ? new Date(trasladoData.Fecha) : null}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Finca origen*</label>
                        <InputText
                            value={trasladoData.Finca_origen}
                            disabled
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Finca destino*</label>
                        <Dropdown
                            value={trasladoData.Finca_destino}
                            options={[
                                { label: 'Panorama', value: 'Panorama' },
                                { label: 'Santa Matilde', value: 'Santa Matilde' },
                                { label: 'Vilaflor', value: 'Vilaflor' }
                            ]}
                            onChange={(e) => updateField(e.value, "Finca_destino")}
                            placeholder="Seleccione una finca"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

const styles = {
    formGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formField: {
        marginBottom: '15px',
    },
};

export default TrasladoForm;