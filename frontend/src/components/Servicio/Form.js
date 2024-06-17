import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from "primereact/inputnumber";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
        Fecha: "",
        Condicion: "",
        Edad: "",
        comentario: "",
        id_ganado: idS,
        Nombre_tipo: "",
        Nombre: "",
        Numero: "",
        id_usuario: 2
    };

    const [servicioData, setServicioData] = useState(inicialServiciosState);

    useEffect(() => {
        if (editServicio) {
            setServicioData(editServicio);
        } else {
            const ganado = ganados.find((p) => p.id === parseInt(idS));
            if (ganado) {
                setServicioData((prevState) => ({
                    ...prevState,
                    Nombre: ganado.Nombre,
                    Numero: ganado.Numero
                }));
            }
        }
    }, [editServicio, ganados, idS]);

    const updateField = (data, field) => {
        console.log(`Actualizando campo ${field} con valor:`, data);
        setServicioData((prevState) => ({
            ...prevState,
            [field]: data
        }));
    };

    const saveServicio = () => {
        if (servicioData.Nombre === "" || servicioData.comentario === "") {
            showInfo();
            console.log("Campos requeridos vacíos:", {
                Nombre: servicioData.Nombre,
                comentario: servicioData.comentario
            });
        } else {
            const formattedDate = servicioData.Fecha ? moment(servicioData.Fecha).format("YYYY-MM-DD") : null;
            const servicioDataWithFormattedDate = {
                ...servicioData,
                Fecha: formattedDate,
            };

            console.log("Intentando guardar servicio con datos:", servicioDataWithFormattedDate);

            if (!editServicio) {
                const nombreTipo = tipoServicios.find((p) => p.id === parseInt(servicioDataWithFormattedDate.id_tipo_servicio));
                servicioDataWithFormattedDate.Nombre_tipo = nombreTipo.Nombre_tipo;
                const ganado = ganados.find((p) => p.id === parseInt(idS));
                servicioDataWithFormattedDate.Nombre = ganado.Nombre;
                servicioDataWithFormattedDate.Numero = ganado.Numero;
                createServicio(servicioDataWithFormattedDate);
            } else {
                servicioDataWithFormattedDate.id_usuario = 2;
                const nombreTipo = tipoServicios.find((p) => p.id === parseInt(servicioDataWithFormattedDate.id_tipo_servicio));
                servicioDataWithFormattedDate.Nombre_tipo = nombreTipo.Nombre_tipo;
                updateServicio(servicioDataWithFormattedDate);
            }
            retornar();
        }
    };

    const toast = useRef(null);
    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteServicio = () => {
        if (editServicio) {
            servicioData.id_usuario = 2;
            deleteServicio(servicioData);
            showError();
        }
        retornar();
    };

    const retornar = () => {
        setServicioData(inicialServiciosState);
        setIsVisible(false);
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000 });
    }

    const dialogFooter = (
        <div style={styles.dialogFooter}>
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteServicio} reject={retornar}
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

    const clearSelected = () => {
        setIsVisible(false);
        setServicioData(inicialServiciosState);
    };

    return (
        <div>
            <Toast ref={toast} position="top-center"></Toast>
            <Dialog
                visible={isVisible}
                modal={true}
                style={{ width: "550px" }}
                contentStyle={{ overflow: "visible" }}
                header="Detalles de servicios"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Tipo</label>
                        <Dropdown value={servicioData.id_tipo_servicio} options={tipoServicios} optionLabel="Nombre_tipo" optionValue="id"
                            onChange={(e) => updateField(e.value, "id_tipo_servicio")} filter showClear filterBy="Nombre_tipo" placeholder="Seleccione un tipo" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha</label>
                        <DatePicker
                            selected={servicioData.Fecha ? new Date(servicioData.Fecha) : null}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Condición</label>
                        <InputText
                            value={servicioData.Condicion}
                            onChange={(e) => updateField(e.target.value, "Condicion")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Edad</label>
                        <InputNumber
                            value={servicioData.Edad}
                            onChange={(e) => updateField(e.value, "Edad")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comentario</label>
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
