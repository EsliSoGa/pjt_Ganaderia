import React, { useState, useContext, useRef, useEffect } from 'react';
import { SalidaContext } from '../../context/SalidaContext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../Ganado/UploadImageStyles.css';

const UploadImage = () => {
    const { salidas, updateSalida } = useContext(SalidaContext);
    const [ganados, setGanados] = useState([]);
    const [selectedGanado, setSelectedGanado] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        // Fetch ganados data from the backend
        const fetchGanados = async () => {
            try {
                const response = await axios.get('http://localhost:8080/ganado'); // Asegúrate de que esta ruta sea correcta
                setGanados(response.data);
            } catch (error) {
                console.error('Error fetching ganados:', error);
            }
        };

        fetchGanados();
    }, []);

    const handleUpload = async () => {
        if (!selectedGanado || !imageFile) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un animal y una imagen' });
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
            const updatedSalida = salidas.find(salida => salida.Id_ganado === selectedGanado.id);
            if (updatedSalida) {
                updatedSalida.Imagen = imagePath;
                updateSalida(updatedSalida);

                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Imagen subida correctamente' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se encontró la salida correspondiente' });
            }
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
                        value={selectedGanado} 
                        options={ganados} 
                        onChange={(e) => setSelectedGanado(e.value)} 
                        optionLabel="numero" 
                        optionValue="id"
                        placeholder="Seleccione un animal" 
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
