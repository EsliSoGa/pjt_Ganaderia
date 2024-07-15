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

import { LecheContext } from "../../context/LecheContext";

const LecheForm = (props) => {
    const { isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createLeche,
        deleteLeche,
        editLeche,
        updateLeche,
        ganados
    } = useContext(LecheContext);

    const inicialLecheState = {
        id: null,
        Fecha: null,
        Produccion_diaria: "",
        Id_ganado: "",
        Nombre: "",
        Numero: "",
        id_usuario: 2
    };

    const [lecheData, setLecheData] = useState(inicialLecheState);

    useEffect(() => {
        if (editLeche) {
            setLecheData({
                ...editLeche,
                Fecha: editLeche.Fecha ? new Date(editLeche.Fecha) : null
            });
        }
    }, [editLeche]);

    const updateField = (data, field) => {
        setLecheData({
            ...lecheData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setLecheData(inicialLecheState);
    };

    const saveLeche = () => {
        if (lecheData.Fecha === null || lecheData.Produccion_diaria === "") {
            showInfo();
        } else {
            const formattedDate = lecheData.Fecha ? moment(lecheData.Fecha).format("YYYY-MM-DD") : null;
            const lecheDataWithFormattedDate = {
                ...lecheData,
                Fecha: formattedDate,
            };

            if (!editLeche) {
                const ganado = ganados.find((p) => p.id === parseInt(lecheData.Id_ganado));
                lecheDataWithFormattedDate.Nombre = ganado.nombre;
                lecheDataWithFormattedDate.Numero = ganado.numero;
                createLeche(lecheDataWithFormattedDate);
            } else {
                lecheDataWithFormattedDate.id_usuario = 2;
                updateLeche(lecheDataWithFormattedDate);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteLeche = () => {
        if (editLeche) {
            lecheData.id_usuario = 2;
            deleteLeche(lecheData);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteLeche} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)} />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveLeche} />
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
                header="Detalle de leche"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Ganado*</label>
                        <Dropdown value={lecheData.Id_ganado} options={ganados} optionLabel="numero" optionValue="id"
                            onChange={(e) => updateField(e.value, "Id_ganado")} filter showClear filterBy="numero" placeholder="Seleccione un ganado" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <DatePicker
                            selected={lecheData.Fecha}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
                            className="p-inputtext p-component"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Producción diaria*</label>
                        <InputText
                            value={lecheData.Produccion_diaria}
                            onChange={(e) => updateField(e.target.value, "Produccion_diaria")}
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

export default LecheForm;
