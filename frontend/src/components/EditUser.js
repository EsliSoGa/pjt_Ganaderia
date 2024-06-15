import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { update } from '../actions/auth';
import ApiKey from '../ApiKey';
import { useSelector } from "react-redux";
const ActualizarUser = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({}); // eslint-disable-line react-hooks/exhaustive-deps

    const validate = (data) => {
        let errors = {};

        if (!data.Nombre) {
            errors.Nombre = 'Name is required.';
        }

        if (!data.Correo) {
            errors.Correo = '¡Correo electrónico es requerido!';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.Correo)) {
            errors.Correo = '¡Correo electrónico invalido! Ejemplo: example@email.com';
        }

        if (!data.Contrasena) {
            errors.Contrasena = '¡Contraseña requerida!';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        update(currentUser.id, currentUser.Id_rol, data.Nombre, data.Correo, data.Contrasena)
        .then(() => {
            setShowMessage(true);
            form.restart();
        })
        .catch(() => {
            form.restart();
        });
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;
    const passwordHeader = <h6>Coloque una contraseña</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Requerimientos</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>Una minúscula</li>
                <li>Una mayúscula</li>
                <li>Un numero minimo</li>
                <li>Minimo 8 caracteres</li>
            </ul>
        </React.Fragment>
    );

    return (

        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>¡Actualización realizada!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        <b>{formData.name}</b> Ya puede iniciar en el sistema como un usuario. <b>{formData.Correo}</b>.
                    </p>
                </div>
            </Dialog>


            <div className="flex justify-content-center">
                    <div className='card card-container'>
                    <h5 className="text-center">Perfil</h5>
                    <Form onSubmit={onSubmit} initialValues={{ Nombre: '', Correo: '', Contrasena: ''}} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">

                            <Field name="Nombre" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-user" />
                                        <InputText placeholder={currentUser.Nombre}  id="Nombre" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="Nombre" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Nombre*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />

                            <Field name="Correo" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label p-input-icon-right">
                                        <i className="pi pi-envelope" />
                                        <InputText id="Correo" {...input} placeholder={currentUser.Correo} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="Correo" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Correo electrónico*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="Contrasena" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="Contrasena" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} header={passwordHeader} footer={passwordFooter} />
                                        <label htmlFor="Contrasena" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Contraseña*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />

                            <Button type="submit" label="Ingresar" className="mt-2" />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}

export default ActualizarUser;