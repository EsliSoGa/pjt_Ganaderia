import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useDispatch } from "react-redux";
import { register } from '../actions/auth';
import './Register.css'; // Importamos el archivo CSS adicional

const Register = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({}); // eslint-disable-line react-hooks/exhaustive-deps

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = (data) => {
        let errors = {};

        if (!data.Nombre) {
            errors.Nombre = 'Nombre es requerido.';
        }

        if (!data.Correo) {
            errors.Correo = 'Correo electrónico es requerido.';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.Correo)) {
            errors.Correo = 'Correo electrónico invalido. Ejemplo: example@email.com';
        }

        if (!data.Contrasena) {
            errors.Contrasena = 'Contraseña requerida.';
        } else if (data.Contrasena.length < 8) {
            errors.Contrasena = '¡La contraseña debe tener al menos 8 caracteres!';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        dispatch(register(3, data.Nombre, data.Correo, data.Contrasena))
            .then(() => {
                setShowMessage(true);
                form.restart();
                navigate("/login");
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
    const passwordHeader = <h6>Colocar una contraseña.</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Requerimientos</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>Una minuscula</li>
                <li>Una mayuscula</li>
                <li>Un numero minimo</li>
                <li>Minimo 8 caracteres</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="register-form-container">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>¡Registro realizado!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        <b>{formData.Nombre}</b> Ya puede iniciar en el sistema como un usuario.<b>{formData.Correo}</b>.
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className='card register-card'>
                    <h5 className="text-center">Registrarse</h5>
                    <Form onSubmit={onSubmit} initialValues={{ Nombre: '', Correo: '', Contrasena: '' }} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <div className="field">
                                <Field name="Nombre" render={({ input, meta }) => (
                                    <div>
                                        <label htmlFor="Nombre" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Nombre*</label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-user" />
                                            <InputText id="Nombre" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} placeholder='Nombre' />
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                            </div>
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
                                            <Password id="Contrasena" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} header={passwordHeader} footer={passwordFooter} placeholder='********' />
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                            </div>
                            <Button type="submit" label="Registrarse" className="mt-2 p-button-rounded p-button-success" style={{ width: '100%' }} />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}

export default Register;
