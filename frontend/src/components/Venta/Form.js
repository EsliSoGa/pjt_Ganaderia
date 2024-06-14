import React, {useContext, useState, useEffect, useRef} from "react";
import {Dialog} from "primereact/dialog";
import { Button } from "primereact/button";
import {InputText} from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from 'primereact/dropdown';
import moment from "moment";

import { VentaContext } from "../../context/VentaContext";

const VentaForm = (props) => {
    const {isVisible, setIsVisible} = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);

    const [ganadoData, setGanadoData] = useState([]);

    const {
        createVenta,
        deleteVenta,
        editVenta,
        updateVenta,
        ganados
    } = useContext(VentaContext);

    const inicialVentasState = {
        id: null,
        Fecha: "",
        Comprador: "",
        Precio: "",
        Peso: "", 
        Total: "",
        Id_ganado: "",
        Nombre: "",
        Numero: "", 
        id_usuario: 2
    };

    const [ventaData, setVentaData] = useState(inicialVentasState);

    useEffect(() => {
        if (editVenta) setVentaData(editVenta);
    }, [editVenta]);

    const updateField = (data, field) => {
        setVentaData({
            ...ventaData,
            [field]: data
        });
    };

    const clearSelected = () => {
        setIsVisible(false);
        setVentaData(inicialVentasState);
    };

    const saveVenta = () => {
        if (ventaData.Fecha === "" || ventaData.Comprador === "" || ventaData.Peso === "") {
            showInfo();
        } else {
            ventaData.Fecha = moment(ventaData.Fecha).format("YYYY-MM-DD");
            if (!editVenta) {
                const ganado = ganados.find((p) => p.id === parseInt(ventaData.Id_ganado));
                setGanadoData(ganado);
                ventaData.Nombre = ganadoData.nombre;
                ventaData.Numero = ganadoData.numero;
                createVenta(ventaData);
            } else {
                ventaData.id_usuario = 2;
                updateVenta(ventaData);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000});
    }

    const _deleteVenta = () => {
        if (editVenta) {
            ventaData.id_usuario = 2;
            deleteVenta(ventaData);
            showError();
        }
        clearSelected();
    };

    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000});
    }

    const dialogFooter = (
        <div className="ui-dialog-buttonpane p-clearfix">
            <ConfirmDialog 
                visible={isVisibleDelete} 
                onHide={() => setisVisibleDelete(false)} 
                message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" 
                icon="pi pi-info-circle" 
                accept={_deleteVenta} 
                reject={clearSelected} 
                acceptClassName="p-button-danger"
            />
            <Button 
                className="p-button-raised p-button-rounded mb-3 p-button-info" 
                icon="pi pi-times" 
                label="Eliminar"
                onClick={() => setisVisibleDelete(true)}
            />
            <Button 
                className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" 
                icon="pi pi-check"
                onClick={saveVenta}
            />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} position="top-center"></Toast>
            <Dialog
                visible={isVisible}
                modal={true}
                style={{width: "550px"}}
                contentStyle={{overflow: "visible"}}
                header="Detalles de Venta"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Ganado*</label>
                        <Dropdown 
                            value={ventaData.Id_ganado} 
                            options={ganados} 
                            optionLabel="numero" 
                            optionValue="id" 
                            onChange={(e) => updateField(e.value, "Id_ganado")} 
                            filter 
                            showClear 
                            filterBy="numero" 
                            placeholder="Seleccione un ganado"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <Calendar
                            value={ventaData.Fecha && new Date(ventaData.Fecha)}
                            onChange={(e) => updateField(e.value, "Fecha")}
                            dateFormat="dd-mm-yy"
                            showIcon
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comprador*</label>
                        <InputText
                            value={ventaData.Comprador}
                            onChange={(e) => updateField(e.target.value, "Comprador")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Precio*</label>
                        <InputNumber
                            value={ventaData.Precio}
                            onChange={(e) => updateField(e.value, "Precio")}
                            mode="decimal" 
                            locale="en-US" 
                            minFractionDigits={2}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Peso*</label>
                        <InputText
                            value={ventaData.Peso}
                            onChange={(e) => updateField(e.target.value, "Peso")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Total*</label>
                        <InputNumber
                            value={ventaData.Total}
                            onChange={(e) => updateField(e.value, "Total")}
                            mode="decimal" 
                            locale="en-US" 
                            minFractionDigits={2}
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
};

export default VentaForm;