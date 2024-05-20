import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import imagen6 from '../images/fondo6.jpg';
const Profile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const header = (
        <img alt="Card" src={imagen6} />
    );
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    function bienvenida(currentUser) {
        if (currentUser.rol === "Administrador") {
            return `Con el rol de administrador tienes acceso a todas las páginas, con permisos de lectura, escritura y edición de todos los datos, asimismo, acceso a todos los reportes.`
        } else if (currentUser.rol === "Jefe") {
            return `Recuerda de que tienes acceso a todas las páginas determinadas a su cargo..`
        } else if (currentUser.rol === "Vaquero") {
            return `Recuerda de que tienes acceso a todas las páginas determinadas a tu cargo.`
        } else if (!currentUser) {
            return null;
        }
    }
    const text = bienvenida(currentUser);

    return (
        <div className="card flex justify-content-center">
            <Card title={currentUser.rol} subTitle={currentUser.Nombre} header={header} className="md:w-25rem">
                <Panel header={currentUser.rol} toggleable>
                    <p className="m-0" align="justify">
                        {text}
                    </p>
                </Panel>
                <Divider />
                <Panel header="Recomendaciones" toggleable>
                    <p className="m-0" align="left">El sistema es privado, por ese motivo, debe de seguir las siguientes recomendaciones:</p>
                    <br />
                    <p className="m-0" align="justify">1. No dejar abierto una sesión en dispositivos extraños. </p>
                    <p className="m-0" align="justify">2. Siempre cerrar sesión si entra por otro dispositivo. </p>
                    <p className="m-0" align="justify">3. Cualquier anomalía, reportarla con el administrador. </p>
                    <p className="m-0" align="justify">4. No olvidar su contraseña. </p>
                    <br />
                    <p className="m-0" align="justify">Estas recomendaciones son para el correcto uso del sistema, recuerde que la seguridad depende de todos. </p>
                </Panel>
            </Card>
        </div>
    );
};

export default Profile;