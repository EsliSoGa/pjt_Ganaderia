import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import { VacunasContext } from "../../context/VacunasContext";

const VacunasForm = (props) => {
    const { isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createVacuna,
        deleteVacuna,
        editVacuna,
        updateVacuna,
        ganados
    } = useContext(VacunasContext);

    const initialVacunaState = {
        id: null,
        fecha_aplicacion: null,
        tipo_vacuna: "",
        dosis: "",
        proxima_aplicacion: null,
        responsable: "",
        observaciones: "",
        id_ganado: "",
        Nombre: "",
        Numero: "",
        id_usuario: 2
    };

    const [vacunaData, setVacunaData] = useState(initialVacunaState);

    useEffect(() => {
        if (editVacuna) {
            setVacunaData({
                ...editVacuna,
                fecha_aplicacion: editVacuna.fecha_aplicacion ? new Date(editVacuna.fecha_aplicacion) : null,
                proxima_aplicacion: editVacuna.proxima_aplicacion ? new Date(editVacuna.proxima_aplicacion) : null
            });
        }
    }, [editVacuna]);

    useEffect(() => {
        if (vacunaData.id_ganado) {
            const ganado = ganados.find((p) => p.id === parseInt(vacunaData.id_ganado));
            if (ganado) {
                setVacunaData((prevState) => ({
                    ...prevState,
                    Nombre: ganado.nombre,
                    Numero: ganado.numero
                }));
            }
        }
    }, [vacunaData.id_ganado, ganados]);

    const updateField = (data, field) => {
        setVacunaData({
            ...vacunaData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setVacunaData(initialVacunaState);
    };

    const saveVacuna = () => {
        if (vacunaData.fecha_aplicacion === null || vacunaData.tipo_vacuna === "" || vacunaData.dosis === "") {
            showInfo();
        } else {
            const formattedFechaAplicacion = vacunaData.fecha_aplicacion ? moment(vacunaData.fecha_aplicacion).format("YYYY-MM-DD") : null;
            const formattedProximaAplicacion = vacunaData.proxima_aplicacion ? moment(vacunaData.proxima_aplicacion).format("YYYY-MM-DD") : null;
            const vacunaDataWithFormattedDate = {
                ...vacunaData,
                fecha_aplicacion: formattedFechaAplicacion,
                proxima_aplicacion: formattedProximaAplicacion,
            };

            if (!editVacuna) {
                const ganado = ganados.find((p) => p.id === parseInt(vacunaData.id_ganado));
                vacunaDataWithFormattedDate.Nombre = ganado.nombre;
                vacunaDataWithFormattedDate.Numero = ganado.numero;
                createVacuna(vacunaDataWithFormattedDate);
            } else {
                vacunaDataWithFormattedDate.id_usuario = 2;
                updateVacuna(vacunaDataWithFormattedDate);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteVacuna = () => {
        if (editVacuna) {
            vacunaData.id_usuario = 2;
            deleteVacuna(vacunaData);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteVacuna} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)} />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveVacuna} />
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
                header="Aplicación de Vacuna"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Ganado*</label>
                        <Dropdown value={vacunaData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id"
                            onChange={(e) => updateField(e.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha de Aplicación*</label>
                        <DatePicker
                            selected={vacunaData.fecha_aplicacion}
                            onChange={(date) => updateField(date, "fecha_aplicacion")}
                            dateFormat="dd-MM-yyyy"
                            className="p-inputtext p-component"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Tipo de Vacuna*</label>
                        <InputText
                            value={vacunaData.tipo_vacuna}
                            onChange={(e) => updateField(e.target.value, "tipo_vacuna")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Dosis*</label>
                        <InputText
                            value={vacunaData.dosis}
                            onChange={(e) => updateField(e.target.value, "dosis")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Próxima Aplicación</label>
                        <DatePicker
                            selected={vacunaData.proxima_aplicacion}
                            onChange={(date) => updateField(date, "proxima_aplicacion")}
                            dateFormat="dd-MM-yyyy"
                            className="p-inputtext p-component"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Responsable</label>
                        <InputText
                            value={vacunaData.responsable}
                            onChange={(e) => updateField(e.target.value, "responsable")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Observaciones</label>
                        <InputText
                            value={vacunaData.observaciones}
                            onChange={(e) => updateField(e.target.value, "observaciones")}
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

export default VacunasForm;
