import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import moment from "moment";

import { ServicioContext } from "../../context/ServicioContext";

const ServicioForm = (props) => {
    const { idS, isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const [ganadoData, setGanadoData] = useState([]);
    const [tipoData, setTipoData] = useState([]);

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
        if (editServicio) setServicioData(editServicio);
    }, [editServicio]);

    const updateField = (data, field) => {
        setServicioData({
            ...servicioData,
            [field]: data
        });
    };

    const saveServicio = () => {
        if (servicioData.Nombre === "" || servicioData.comentario === "") {
            showInfo();
        } else {
            servicioData.Fecha = moment(servicioData.Fecha).format("YYYY-MM-DD");

            if (!editServicio) {
                const nombreTipo = tipoServicios.find((p) => p.id === parseInt(servicioData.id_tipo_servicio));
                setTipoData(nombreTipo);
                servicioData.Nombre_tipo = tipoData.Nombre_tipo;
                const ganado = ganados.find((p) => p.id === parseInt(idS));
                setGanadoData(ganado);
                servicioData.Nombre = ganadoData.nombre;
                servicioData.Numero = ganadoData.numero;
                createServicio(servicioData);
            } else {
                servicioData.id_usuario = 2;
                const nombreTipo = tipoServicios.find((p) => p.id === parseInt(servicioData.id_tipo_servicio));
                setTipoData(nombreTipo);
                servicioData.Nombre_tipo = tipoData.Nombre_tipo;
                updateServicio(servicioData);
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
                        <Calendar
                            value={servicioData.Fecha && new Date(servicioData.Fecha)}
                            onChange={(e) => updateField(e.target.value.toISOString(), "Fecha")}
                            dateFormat="dd-mm-yy"
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