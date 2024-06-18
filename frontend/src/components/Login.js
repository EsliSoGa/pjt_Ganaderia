import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { Form, Field } from 'react-final-form';
import { login } from "../actions/auth";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';

import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import './Login.css'; // Importamos el archivo CSS adicional

const Login = () => {

    const [showMessage, setShowMessage] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = (data) => {
        let errors = {};

        if (!data.Correo) {
            errors.Correo = '¡El correo electrónico es requerido!';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.Correo)) {
            errors.Correo = '¡Correo electrónico no válido! Ejemplo: example@email.com';
        }

        if (!data.Contrasena) {
            errors.Contrasena = '¡Contraseña requerida!';
        } else if (data.Contrasena.length < 8) {
            errors.Contrasena = '¡La contraseña debe tener al menos 8 caracteres!';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        dispatch(login(data.Correo, data.Contrasena))
            .then(() => {
                setShowMessage(true);
                navigate("/profile");
                window.location.reload();
            })
            .catch(() => {
                form.restart();
            });
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;

    return (
        <div className="login-form-container">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>¡Inicio de sesión exitoso!</h5>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className='card login-card'>
                    <h5 className="text-center">Inicio de sesión</h5>
                    <Form onSubmit={onSubmit} initialValues={{ Correo: '', Contrasena: '' }} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <div className="field">
                                <Field name="Correo" render={({ input, meta }) => (
                                    <div>
                                        <label htmlFor="Correo" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Correo electrónico*</label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-envelope" />
                                            <InputText id="Correo" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} placeholder='example@gmail.com' />
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                            </div>
                            <div className="field">
                                <Field name="Contrasena" render={({ input, meta }) => (
                                    <div>
                                        <label htmlFor="Contrasena" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Contraseña*</label>
                                        <span className="p-float-label">
                                            <Password id="Contrasena" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} placeholder='********' />
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                            </div>
                            <Button type="submit" label="Ingresar" className="mt-2 p-button-rounded p-button-success" style={{ width: '100%' }} />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
};

export default Login;
