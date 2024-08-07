import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import jsPDF from "jspdf";
import "jspdf-autotable";
import cowLogo from "../images/vaca1.jpg"; // Asegúrate de tener una imagen de logo de vaca
import "./ActividadesScreen.css"; // Importar el archivo CSS

const ActividadesScreen = () => {
  const [events, setEvents] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [newActivity, setNewActivity] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    comentarios: "",
    estado: "Nueva"
  });
  const [selectedEstado, setSelectedEstado] = useState(null);
  
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const estados = [
    { label: 'Nueva', value: 'Nueva' },
    { label: 'En progreso', value: 'En progreso' },
    { label: 'Finalizado', value: 'Finalizado' },
    { label: 'Atrasada', value: 'Atrasada' }
  ];

  const toast = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get("http://localhost:8080/actividades");
    const data = response.data.map((activity) => ({
      id: activity.id,
      title: activity.nombre,
      start: activity.fecha,
      backgroundColor: getEstadoColor(activity.estado),
      borderColor: getEstadoColor(activity.estado),
      extendedProps: {
        descripcion: activity.descripcion,
        comentarios: activity.comentarios,
        estado: activity.estado
      },
    }));
    setEvents(data);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Nueva':
        return 'blue';
      case 'En progreso':
        return 'yellow';
      case 'Finalizado':
        return 'green';
      case 'Atrasada':
        return 'red';
      default:
        return 'blue';
    }
  };

  const handleDateClick = (arg) => {
    setNewActivity({
      nombre: "",
      descripcion: "",
      fecha: arg.date,
      comentarios: "",
      estado: "Nueva"
    });
    setIsDialogVisible(true);
    setEditMode(false);
    setSelectedEventId(null);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEventId(event.id);
    setNewActivity({
      nombre: event.title,
      descripcion: event.extendedProps.descripcion,
      fecha: new Date(event.start),
      comentarios: event.extendedProps.comentarios,
      estado: event.extendedProps.estado
    });
    setEditMode(true);
    setIsDialogVisible(true);
  };

  const clearForm = () => {
    setNewActivity({
      nombre: "",
      descripcion: "",
      fecha: "",
      comentarios: "",
      estado: "Nueva"
    });
    setIsDialogVisible(false);
    setEditMode(false);
    setSelectedEventId(null);
  };

  const handleSave = async () => {
    const formattedDate = moment(newActivity.fecha).format("YYYY-MM-DD");
    const activityData = {
      ...newActivity,
      fecha: formattedDate,
    };

    if (editMode) {
      await axios.put(`http://localhost:8080/actividades/${selectedEventId}`, activityData);
    } else {
      await axios.post("http://localhost:8080/actividades", activityData);
      handleNotification('Nueva Actividad', `Se ha creado la actividad "${newActivity.nombre}".`);
    }
    
    fetchEvents();
    clearForm();
  };

  const handleDelete = async () => {
    if (selectedEventId) {
      await axios.delete(`http://localhost:8080/actividades/${selectedEventId}`);
      fetchEvents();
      clearForm();
    }
  };

  const handleNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    const upcomingActivities = events.filter(event => {
      const eventDate = moment(event.start);
      const currentDate = moment();
      const diffDays = eventDate.diff(currentDate, 'days');
      return diffDays === 2;
    });

    upcomingActivities.forEach(activity => {
      handleNotification('Actividad Próxima', `La actividad "${activity.title}" será en dos días.`);
    });
  }, [events]);

  const handleEstadoFilterChange = (e) => {
    setSelectedEstado(e.value);
  };

  const clearEstadoFilter = () => {
    setSelectedEstado(null);
  };

  const filteredEvents = selectedEstado ? events.filter(event => event.extendedProps.estado === selectedEstado) : events;

  const downloadPDF = () => {
    const doc = new jsPDF('landscape'); // Cambiar a horizontal
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const logoWidth = 50;
    const logoHeight = 30;

    // Dibujar el borde
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Agregar el logo
    doc.addImage(cowLogo, 'PNG', pageWidth - logoWidth - margin, margin, logoWidth, logoHeight);

    // Título y detalles del lugar
    doc.setFontSize(18);
    doc.text("Historial de Actividades", margin + 10, margin + 20);
    doc.setFontSize(12);
    doc.text("Ganadería XYZ", margin + 10, margin + 30); // Ejemplo de nombre de ganadería
    doc.text("Ubicación: Dirección de la ganadería", margin + 10, margin + 36);
    doc.text("Teléfono: (123) 456-7890", margin + 10, margin + 42);
    doc.text("Generado el: " + moment().format('YYYY-MM-DD HH:mm:ss'), margin + 10, margin + 48);

    // Añadir la tabla de actividades
    doc.autoTable({
      startY: margin + 55,
      head: [['ID', 'Nombre', 'Descripción', 'Fecha', 'Comentarios', 'Estado']],
      body: events.map(event => [
        event.id,
        event.title,
        event.extendedProps.descripcion,
        moment(event.start).format('YYYY-MM-DD'),
        event.extendedProps.comentarios,
        event.extendedProps.estado
      ]),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12
      },
      bodyStyles: {
        minCellHeight: 10
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 65, bottom: 10 } // Ajuste de márgenes para la tabla
    });

    doc.save("historial_actividades.pdf");
  };

  return (
    <div className="calendar-container">
      <div className="p-field">
        <label htmlFor="filtro-estado">Filtrar por estado</label>
        <Dropdown id="filtro-estado" value={selectedEstado} options={estados} onChange={handleEstadoFilterChange} placeholder="Seleccione un estado" />
        <Button label="Limpiar filtro" icon="pi pi-times" onClick={clearEstadoFilter} className="p-button-outlined p-button-secondary ml-2" />
        <Button label="Descargar Historial" icon="pi pi-file-pdf" onClick={downloadPDF} className="p-button-outlined p-button-secondary ml-2" />
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        height={isMobile ? "auto" : "600px"} // Ajusta la altura del calendario
        style={{ width: isMobile ? '100%' : '90%', margin: '0 auto' }} // Ajusta el ancho del calendario
      />
      <Dialog header={editMode ? "Editar Actividad" : "Nueva Actividad"} visible={isDialogVisible} onHide={clearForm}>
        <div className="p-field">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={newActivity.nombre} onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} />
        </div>
        <div className="p-field">
          <label htmlFor="descripcion">Descripción</label>
          <InputText id="descripcion" value={newActivity.descripcion} onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })} />
        </div>
        <div className="p-field">
          <label htmlFor="fecha">Fecha</label>
          <DatePicker
            selected={newActivity.fecha}
            onChange={(date) => setNewActivity({ ...newActivity, fecha: date })}
            dateFormat="yyyy-MM-dd"
            className="p-inputtext p-component"
          />
        </div>
        <div className="p-field">
          <label htmlFor="estado">Estado</label>
          <Dropdown id="estado" value={newActivity.estado} options={estados} onChange={(e) => setNewActivity({ ...newActivity, estado: e.value })} placeholder="Seleccione un estado" />
        </div>
        <div className="p-field">
          <label htmlFor="comentarios">Comentarios</label>
          <InputText id="comentarios" value={newActivity.comentarios} onChange={(e) => setNewActivity({ ...newActivity, comentarios: e.target.value })} />
        </div>
        <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
        {editMode && <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />}
      </Dialog>
    </div>
  );
};

export default ActividadesScreen;
