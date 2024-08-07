import React, { useContext, useState, useEffect } from "react";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import moment from "moment";
import { SalidaContext } from "../../context/SalidaContext";
import SalidaForm from './Form';
import UploadImage from './UploadImage';
import '../SharedTableStyles.css'; // Importamos el archivo CSS general

const SalidaList = () => {
    const { salidas, findSalida } = useContext(SalidaContext);

    const [isVisible, setIsVisible] = useState(false);

    const dateSalida = (salida) => {
        return moment(salida.Fecha).format("DD/MM/YYYY");
    }

    let cont = 0;
    const numero = () => {
        cont = cont + 1;
        return cont;
    }

    const saveSalida = (id) => {
        findSalida(id);
        setIsVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar salida"
                    onClick={() => setIsVisible(true)} />
            </React.Fragment>
        )
    }

    const imageTemplate = (salida) => {
        return <img src={`http://localhost:8080/${salida.Imagen}`} alt={salida.Motivo} style={{ width: '50px', height: '50px' }} />;
    }

    //Filtro
    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const initFilters1 = () => {
        setFilters1({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue1('');
    }
    const clearFilter1 = () => {
        initFilters1();
    }
    useEffect(() => {
        initFilters1();
    }, []);
    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    }
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between align-items-center table-header">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" className="p-button-outlined" onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar" />
                </span>
            </div>
        )
    }
    const header1 = renderHeader1();

    return (
        <div className="table-container">
            <Toolbar className="mr-2" start={leftToolbarTemplate}></Toolbar>
            <Panel header="Listado de salida aprobadas" className="table-panel">
                <div className="table-datatable">
                    <DataTable
                        value={salidas}
                        responsiveLayout="scroll"
                        selectionMode="single"
                        onSelectionChange={(e) => saveSalida(e.value.id)}
                        paginator className="p-datatable-customers" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"
                        globalFilterFields={['Fecha', 'Motivo']} header={header1} emptyMessage="No se encontraron salidas."
                    >
                        <Column body={numero} header="No." sortable className="table-column" />
                        <Column field="Numero" header="Ganado" sortable className="table-column" />
                        <Column field="Fecha" body={dateSalida} header="Fecha de venta" sortable className="table-column" />
                        <Column field="Motivo" header="Motivo" sortable className="table-column" />
                        <Column field="Imagen" body={imageTemplate} header="Imagen" sortable className="table-column" />
                        <Column field="Comentarios" header="Comentarios" sortable className="table-column" />
                    </DataTable>
                </div>
            </Panel>
            <SalidaForm isVisible={isVisible} setIsVisible={setIsVisible} />
            <UploadImage />
        </div>
    );
}

export default SalidaList;
