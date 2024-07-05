import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

import { UsuarioContext } from "../../context/UsuarioContext";
import { Password } from "primereact/password";
import { useSelector } from "react-redux";

const ChangePassForm = (props) => {
    const { isVisible, setIsVisible, retornarForms } = props;
    const { user: currentUser } = useSelector((state) => state.auth);

    const {
        editUsuarios,
        changePassUsuario
    } = useContext(UsuarioContext);

    const inicialUsuarioState = {
        id: null,
        Nombre: "", 
        Contrasena: "",
        confirmContrasena: "",
        id_usuario: currentUser.id
    };

    const [usuarioData, setUsuarioData] = useState(inicialUsuarioState);

    useEffect(() => {
        if (editUsuarios) {
            setUsuarioData({
                ...editUsuarios,
                id_usuario: currentUser.id
            })
        }
    }, [editUsuarios, currentUser]);

    const updateField = (data, field) => {
        console.log(field, data);
        setUsuarioData({
            ...usuarioData,
            [field]: data
        });
    };

    const saveUsuario = () => {
        console.log(usuarioData);
        if (usuarioData.confirmContrasena === "" || usuarioData.Contrasena === "") {
            showInfo();
        } else {
            console.log(usuarioData);
            if (usuarioData.confirmContrasena !== usuarioData.Contrasena) {
                showInfoPass();
            }
            else {
                changePassUsuario(usuarioData);
                retornar();
            }
        }
    };

    const toast = useRef(null);
    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    
    const showInfoPass = () => {
        toast.current.show({ severity: 'error', summary: 'Mensaje', detail: 'Las contraseñas deben de ser iguales', life: 3000 });
    }

    const retornar = async () => {
        await setUsuarioData(inicialUsuarioState);
        setIsVisible(false);
        retornarForms();
    };


    const dialogFooter = (
        <div style={styles.dialogFooter}>
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                label="Guardar" icon="pi pi-check"
                onClick={saveUsuario} />
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
                header="Detalles de servicios"
                onHide={() => retornar()}
                footer={dialogFooter}
            >
                <div style={styles.formGrid}>
                    <div className="p-field" style={styles.formField}>
                        <label>Contraseña</label>
                        <Password
                            value={usuarioData.Contrasena}
                            onChange={(e) => updateField(e.target.value.trim(), "Contrasena")}
                            toggleMask
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Repita la contraseña</label>
                        <Password
                            value={usuarioData.confirmContrasena}
                            onChange={(e) => updateField(e.target.value.trim(), "confirmContrasena")}
                            toggleMask
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

export default ChangePassForm;
