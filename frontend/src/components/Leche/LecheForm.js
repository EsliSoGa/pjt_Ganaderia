import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { LecheContext } from "../../context/LecheContext";

const LecheForm = (props) => {
    const { isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createLeche,
        deleteLeche,
        editLeche,
        updateLeche,
    } = useContext(LecheContext);

    const inicialLecheState = {
        id: null,
        Fecha: "",
        Produccion_diaria: "",
        Id_ganado: null
    };

    const [lecheData, setLecheData] = useState(inicialLecheState);

    useEffect(() => {
        if (editLeche) setLecheData(editLeche);
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
        if (lecheData.Fecha === "" || lecheData.Produccion_diaria === "") {
            showInfo();
        } else {
            const formattedDate = lecheData.Fecha ? moment(lecheData.Fecha).format("YYYY-MM-DD") : null;
            const lecheDataWithFormattedDate = {
                ...lecheData,
                Fecha: formattedDate,
            };

            if (!editLeche) {
                createLeche(lecheDataWithFormattedDate);
            } else {
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
            deleteLeche(lecheData.id);
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
                header="Detalles de la leche"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <DatePicker
                            selected={lecheData.Fecha ? new Date(lecheData.Fecha) : null}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
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
