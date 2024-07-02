import React, { useContext, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { UsuarioContext } from "../../context/UsuarioContext";
import { Password } from "primereact/password";
import { useSelector } from "react-redux";

const UsuarioForm = (props) => {
    const { isVisible, setIsVisible } = props;
    const [isVisibleDelete, setisVisibleDelete] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState([true]);
    const { user: currentUser } = useSelector((state) => state.auth);

    const {
        createUsuario,
        deleteUsuario,
        editUsuarios,
        updateUsuario,
        rol,
    } = useContext(UsuarioContext);

    const inicialUsuarioState = {
        id: null,
        Contrasena: "",
        Correo: "",
        Nombre: "",
        Id_rol: 3,
        rol: "",
        id_usuario: currentUser.id
    };

    const [usuarioData, setUsuarioData] = useState(inicialUsuarioState);

    useEffect(() => {
        if (editUsuarios) {
            setVisiblePassword(false);
            setUsuarioData({
                ...editUsuarios,
                id_usuario: currentUser.id
            })
        }
        else{
            setVisiblePassword(true);
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
        if (usuarioData.Correo === "" || usuarioData.Contrasena === "") {
            showInfo();
        } else {
            if (!editUsuarios) {
                createUsuario(usuarioData);
            } else {
                updateUsuario(usuarioData);
            }
        }
        retornar();
    };

    const toast = useRef(null);
    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Mensaje', detail: 'Debe de llenar todos los campos requeridos (*)', life: 3000 });
    }

    const _deleteUsuario = () => {
        if (editUsuarios) {
            deleteUsuario(usuarioData);
            showError();
        }
        retornar();
    };

    const retornar = async () => {
        setVisiblePassword(true);
        await setUsuarioData(inicialUsuarioState);
        setIsVisible(false);
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Eliminado', detail: 'Se ha eliminado con éxito', life: 3000 });
    }

    const dialogFooter = (
        <div style={styles.dialogFooter}>
            <ConfirmDialog visible={isVisibleDelete} onHide={() => setisVisibleDelete(false)} message="¿Está seguro de eliminar?"
                header="Confirmación de eliminación" icon="pi pi-info-circle" accept={_deleteUsuario} reject={retornar}
                acceptClassName="p-button-danger"
            />
            <Button className="p-button-raised p-button-rounded mb-3 p-button-info"
                icon="pi pi-times" label="Eliminar"
                onClick={() => setisVisibleDelete(true)} />
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
                        <label>Rol</label>
                        <Dropdown value={usuarioData.Id_rol} options={rol} optionLabel="rol" optionValue="id"
                            onChange={(e) => updateField(e.value, "Id_rol")} filter showClear filterBy="rol" placeholder="Seleccione un rol" />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Nombre</label>
                        <InputText
                            value={usuarioData.Nombre}
                            onChange={(e) => updateField(e.target.value, "Nombre")}
                        />
                    </div>
                    <div className="p-field" style={styles.formField}>
                        <label>Correo electronico</label>
                        <InputText
                            value={usuarioData.Correo}
                            onChange={(e) => updateField(e.target.value.trim(), "Correo")}
                        />
                    </div>
                    {visiblePassword && <div className="p-field" style={styles.formField}>
                        <label>Contraseña</label>
                        <Password
                            value={usuarioData.Contrasena}
                            onChange={(e) => updateField(e.target.value.trim(), "Contrasena")}
                            toggleMask
                        />
                    </div>}
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

export default UsuarioForm;
