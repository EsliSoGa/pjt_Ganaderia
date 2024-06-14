import React, { useContext, useState, useEffect } from "react";
import { GanadoContext } from "../../context/GanadoContext";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import Form from './Form';

import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import moment from "moment";
import '../SharedTableStyles.css'; // Importamos el archivo CSS general

const GanadoList = () => {
    const { ganados, findGanado } = useContext(GanadoContext);

    let cont = 0;

    const numero = () => {
        cont = cont + 0.5;
        return cont;
    }

    const estadoTemplate = (ganados) => {
        return <span className={`${ganados.estado ? "activo" : "inactivo"}`}>{ganados.estado ? " Activo " : " Inactivo "}</span>;
    }
    const dateGanado = (ganados) => {
        return moment(ganados.fecha).format("DD/MM/YYYY");
    }
    const [isVisible, setIsVisible] = useState(false);

    const saveGanado = (id) => {
        findGanado(id);
        setIsVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar ganado"
                    onClick={() => setIsVisible(true)} />
            </React.Fragment>
        )
    }

    //Filtro
    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const initFilters1 = () => {
        setFilters1({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
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
            <Panel header="Listado del ganado" className="table-panel">
                <div className="table-datatable">
                    <DataTable
                        value={ganados}
                        responsiveLayout="scroll"
                        selectionMode="single"
                        onSelectionChange={(e) => saveGanado(e.value.id)}
                        paginator className="p-datatable-customers" showGridlines rows={15}
                        dataKey="id" filters={filters1} filterDisplay="menu"
                        globalFilterFields={['nombre', 'numero', 'sexo', 'estado', 'finca', 'tipo', 'peso', dateGanado, 'tipo_nacimiento']} header={header1} emptyMessage="No se encontró el ganado."
                    >
                        <Column body={numero} header="No." sortable className="table-column" />
                        <Column field="nombre" header="Nombre" sortable className="table-column" />
                        <Column field="numero" header="Número" sortable className="table-column" />
                        <Column field="sexo" header="Sexo" sortable className="table-column" />
                        <Column field="color" header="Color" sortable className="table-column" />
                        <Column field="peso" header="Peso" sortable className="table-column" />
                        <Column field="fecha" body={dateGanado} header="Fecha de nacimiento" sortable className="table-column" />
                        <Column field="tipo" header="Tipo" sortable className="table-column" />
                        <Column field="finca" header="Finca" sortable className="table-column" />
                        <Column field='estado' body={estadoTemplate} header="Estado" sortable className="table-column" />
                        <Column field="comentarios" header="Comentario" sortable className="table-column" />
                        <Column field="padre" header="Padre" sortable className="table-column" />
                        <Column field="madre" header="Madre" sortable className="table-column" />
                        <Column field="tipo_nacimiento" header="Tipo nacimiento" sortable className="table-column" />
                    </DataTable>
                </div>
            </Panel>
            <Form isVisible={isVisible} setIsVisible={setIsVisible} />
        </div>
    );
}

export default GanadoList;
