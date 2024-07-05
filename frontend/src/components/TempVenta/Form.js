import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from "primereact/inputnumber";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { TempVentaContext } from "../../context/TempVentaContext";

const TempVentaForm = (props) => {
    const { idTV, isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [isVisibleButton, setIsVisibleButton] = useState(false);

    const {
        createTempVenta,
        deleteTempVenta,
        editTempVenta,
        updateTempVenta,
        ganados
    } = useContext(TempVentaContext);

    const inicialTempVentasState = {
        id: null,
        Fecha: "",
        Comprador: "",
        Precio: "",
        Peso: "",
        Total: "",
        Id_ganado: idTV,
        Numero: ""
    };

    const [tempVentaData, setTempVentaData] = useState(inicialTempVentasState);

    useEffect(() => {
        if (editTempVenta) {
            setTempVentaData(editTempVenta);
            setIsVisibleButton(true);
        } else {
            const ganado = ganados.find((p) => p.id === parseInt(idTV));
            if (ganado) {
                setTempVentaData((prevState) => ({
                    ...prevState,
                    Numero: ganado.numero
                }));
            }
        }
    }, [editTempVenta, ganados, idTV]);

    const updateField = (data, field) => {
        setTempVentaData({
            ...tempVentaData,
            [field]: data
        });
    };

    const clearSelected =  async () => {
        await setTempVentaData(inicialTempVentasState);
        setIsVisibleButton(false);
        setIsVisible(false);
    };

    const saveTempVenta = () => {
        if (tempVentaData.Fecha === "" || tempVentaData.Comprador === "" || tempVentaData.Peso === "") {
            showInfo();
        }
        else {
            const formattedDate = tempVentaData.Fecha ? moment(tempVentaData.Fecha).format("YYYY-MM-DD") : null;
            const tempVentaDataWithFormattedDate = {
                ...tempVentaData,
                Fecha: formattedDate,
            };

            if (!editTempVenta) {
                createTempVenta(tempVentaDataWithFormattedDate);
            } else {
                updateTempVenta(tempVentaDataWithFormattedDate);
            }
            clearSelected();
        }
    };

    const toast = useRef(null);

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteTempVenta = () => {
        if (editTempVenta) {
            deleteTempVenta(tempVentaData.id);
            showError();
        }
        clearSelected();
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000 });
    }

    const dialogFooter = (
        <div style={styles.dialogFooter}>
            <ConfirmDialog
                visible={isVisibleDelete}
                onHide={() => setisVisibleDelete(false)}
                message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación"
                icon="pi pi-info-circle"
                accept={_deleteTempVenta}
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
                onClick={saveTempVenta}
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
                header="Detalles de Venta"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Ganado Número*</label>
                        <InputText
                            value={tempVentaData.Numero}
                            disabled
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Fecha*</label>
                        <DatePicker
                            selected={tempVentaData.Fecha ? new Date(tempVentaData.Fecha) : null}
                            onChange={(date) => updateField(date, "Fecha")}
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Comprador*</label>
                        <InputText
                            value={tempVentaData.Comprador}
                            onChange={(e) => updateField(e.target.value, "Comprador")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Precio*</label>
                        <InputNumber
                            value={tempVentaData.Precio}
                            onChange={(e) => updateField(e.value, "Precio")}
                            mode="decimal" locale="en-US" minFractionDigits={2}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Peso*</label>
                        <InputText
                            value={tempVentaData.Peso}
                            onChange={(e) => updateField(e.target.value, "Peso")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Total*</label>
                        <InputNumber
                            value={tempVentaData.Total}
                            onChange={(e) => updateField(e.value, "Total")}
                            mode="decimal" locale="en-US" minFractionDigits={2}
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

export default TempVentaForm;
