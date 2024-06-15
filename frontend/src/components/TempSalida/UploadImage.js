import React, { useState, useContext, useRef } from 'react';
import { TempSalidaContext } from '../../context/TempSalidaContext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../Ganado/UploadImageStyles.css'; // Archivo CSS para estilos adicionales

const UploadImage = () => {
    const { tempSalidas, updateTempSalida } = useContext(TempSalidaContext);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const toast = useRef(null);

    const handleUpload = async () => {
        if (!selectedAnimal || !imageFile) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un animal y una imagen' });
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('motivo', selectedAnimal.Motivo);

        try {
            const response = await axios.post('http://localhost:8080/tmpsalida/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imagePath = response.data.filePath;
            const updatedSalida = { ...selectedAnimal, Imagen: imagePath };
            updateTempSalida(updatedSalida);

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Imagen subida correctamente' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir la imagen' });
        }
    };

    return (
        <div className="upload-image-container">
            <Toast ref={toast} />
            <h2>Subir Imagen de Salida Temporal</h2>
            <div className="upload-form">
                <div className="field">
                    <Dropdown 
                        value={selectedAnimal} 
                        options={tempSalidas} 
                        onChange={(e) => setSelectedAnimal(e.value)} 
                        optionLabel="Motivo" 
                        placeholder="Seleccione un motivo de salida" 
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
