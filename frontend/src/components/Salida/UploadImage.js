import React, { useState, useContext, useRef } from 'react';
import { SalidaContext } from '../../context/SalidaContext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../Ganado/UploadImageStyles.css';

const UploadImage = () => {
    const { salidas, updateSalida } = useContext(SalidaContext);
    const [selectedSalida, setSelectedSalida] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const toast = useRef(null);

    const handleUpload = async () => {
        if (!selectedSalida || !imageFile) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una salida y una imagen' });
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post('http://localhost:8080/salida/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imagePath = response.data.filePath;
            const updatedSalida = { ...selectedSalida, Imagen: imagePath };
            updateSalida(updatedSalida);

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Imagen subida correctamente' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir la imagen' });
        }
    };

    return (
        <div className="upload-image-container">
            <Toast ref={toast} />
            <h2>Subir Imagen de Salida</h2>
            <div className="upload-form">
                <div className="field">
                    <Dropdown 
                        value={selectedSalida} 
                        options={salidas} 
                        onChange={(e) => setSelectedSalida(e.value)} 
                        optionLabel="Motivo" 
                        placeholder="Seleccione una salida" 
                        className="dropdown"
                    />
                </div>
                <div className="field">
                    <InputText 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                        className="file-input"
                    />
                </div>
                <Button label="Subir Imagen" icon="pi pi-upload" className="upload-button" onClick={handleUpload} />
            </div>
        </div>
    );
};

export default UploadImage;
