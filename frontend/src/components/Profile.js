import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import imagen6 from '../images/fondo6.jpg';

const Profile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const header = (
        <img alt="Card" src={imagen6} style={{ borderRadius: '8px' }} />
    );

    function bienvenida(currentUser) {
        if (currentUser.rol === "Administrador") {
            return `Con el rol de administrador tienes acceso a todas las páginas, con permisos de lectura, escritura y edición de todos los datos, asimismo, acceso a todos los reportes.`
        } else if (currentUser.rol === "Jefe") {
            return `Recuerda de que tienes acceso a todas las páginas determinadas a su cargo.`
        } else if (currentUser.rol === "Vaquero") {
            return `Recuerda de que tienes acceso a todas las páginas determinadas a tu cargo.`
        } else if (!currentUser) {
            return null;
        }
    }
    
    const text = bienvenida(currentUser);

    return (
        <div className="profile-container" style={styles.profileContainer}>
            <Card title={currentUser.rol} subTitle={currentUser.Nombre} header={header} className="md:w-25rem" style={styles.card}>
                <Panel header={currentUser.rol} toggleable style={styles.panel}>
                    <p className="m-0" align="justify" style={styles.text}>
                        {text}
                    </p>
                </Panel>
                <Divider />
                <Panel header="Recomendaciones" toggleable style={styles.panel}>
                    <p className="m-0" align="left" style={styles.text}>El sistema es privado, por ese motivo, debe de seguir las siguientes recomendaciones:</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>No dejar abierto una sesión en dispositivos extraños.</li>
                        <li style={styles.listItem}>Siempre cerrar sesión si entra por otro dispositivo.</li>
                        <li style={styles.listItem}>Cualquier anomalía, reportarla con el administrador.</li>
                        <li style={styles.listItem}>No olvidar su contraseña.</li>
                    </ul>
                    <p className="m-0" align="justify" style={styles.text}>Estas recomendaciones son para el correcto uso del sistema, recuerde que la seguridad depende de todos.</p>
                </Panel>
            </Card>
        </div>
    );
};

const styles = {
    profileContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#e0f7fa', // Fondo azul claro
        minHeight: 'calc(100vh - 60px)', // Ajusta el alto para evitar solaparse con el navbar
        marginTop: '60px' // Asegura que no se monte sobre el navbar
    },
    card: {
        width: '80%',
        maxWidth: '600px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
        border: '2px solid #00796b' // Borde verde oscuro
    },
    panel: {
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #00796b', // Borde verde oscuro
        borderRadius: '8px'
    },
    text: {
        color: '#004d40', // Color de texto verde oscuro
        lineHeight: '1.5'
    },
    list: {
        padding: '0',
        marginLeft: '20px',
        color: '#004d40' // Color de texto verde oscuro
    },
    listItem: {
        marginBottom: '10px',
        lineHeight: '1.5'
    }
};

export default Profile;
