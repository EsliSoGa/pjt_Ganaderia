import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { ServicioContext } from "../../context/ServicioContext";

const ServicioForm = (props) => {
    const { idS, isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const {
        createServicio,
        deleteServicio,
        editServicio,
        updateServicio,
        tipoServicios,
        ganados
    } = useContext(ServicioContext);

    const inicialServiciosState = {
        id: null,
        Fecha: null,
        Condicion: "",
        Edad: "",
        comentario: "",
        id_ganado: idS,
        Nombre_tipo: "",
        id_usuario: 2
    };

    const [servicioData, setServicioData] = useState(inicialServiciosState);

    useEffect(() => {
        if (editServicio) {
            setServicioData({
                ...editServicio,
                Fecha: editServicio.Fecha ? new Date(editServicio.Fecha) : null
            });
        }
    }, [editServicio]);

    const updateField = (data, field) => {
        setServicioData({
            ...servicioData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setServicioData(inicialServiciosState);
    };

    const saveServicio = () => {
        if (servicioData.Condicion === "" || servicioData.comentario === "") {
            showInfo();
        } else {
            const formattedDate = servicioData.Fecha ? moment(servicioData.Fecha).format("YYYY-MM-DD") : null;
            const servicioDataWithFormattedDate = {
                ...servicioData,
                Fecha: formattedDate,
            };

            if (!editServicio) {
                createServicio(servicioDataWithFormattedDate);
            } else {
                servicioDataWithFormattedDate.id_usuario = 2;
                updateServicio(servicioDataWithFormattedDate);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteServicio = () => {
        if (editServicio) {
            deleteServicio(servicioData);
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
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteServicio} reject={clearSelected}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)} />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveServicio} />
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
                header="Detalle de servicio"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Tipo de servicio*</label>
                        <Dropdown value={servicioData.id_tipo_servicio} options={tipoServicios} optionLabel="Nombre_tipo" optionValue="id"
                            onChange={(e) => updateField(e.value, "id_tipo_servicio")} filter showClear filterBy="Nombre_tipo" placeholder="Seleccione un tipo" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <Calendar
                            value={servicioData.Fecha}
                            onChange={(e) => updateField(e.value, "Fecha")}
                            dateFormat="dd-mm-yy"
                            className="p-inputtext p-component"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Condición*</label>
                        <InputText
                            value={servicioData.Condicion}
                            onChange={(e) => updateField(e.target.value, "Condicion")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Meses de gestacion*</label>
                        <InputNumber
                            value={servicioData.Edad}
                            onChange={(e) => updateField(e.value, "Edad")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comentario*</label>
                        <InputText
                            value={servicioData.comentario}
                            onChange={(e) => updateField(e.target.value, "comentario")}
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

export default ServicioForm;
