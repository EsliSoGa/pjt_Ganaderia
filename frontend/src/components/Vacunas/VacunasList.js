import React, { useContext, useState, useEffect } from "react";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import moment from "moment";
import { VacunasContext } from "../../context/VacunasContext";
import VacunasForm from './VacunasForm';
import '../SharedTableStyles.css'; // Importamos el archivo CSS general

const VacunasList = () => {
    const { vacunas, findVacuna } = useContext(VacunasContext);

    const [isVisible, setIsVisible] = useState(false);

    const dateVacuna = (vacuna) => {
        return moment(vacuna.fecha_aplicacion).format("DD/MM/YYYY");
    }

    let cont = 0;
    const numero = () => {
        cont = cont + 1;
        return cont;
    }

    const saveVacuna = (id) => {
        findVacuna(id);
        setIsVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar vacuna"
                    onClick={() => setIsVisible(true)} />
            </React.Fragment>
        )
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
            <Panel header="Listado de aplicaciones de vacunas" className="table-panel">
                <div className="table-datatable">
                    <DataTable
                        value={vacunas}
                        responsiveLayout="scroll"
                        selectionMode="single"
                        onSelectionChange={(e) => saveVacuna(e.value.id)}
                        paginator className="p-datatable-customers" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"
                        globalFilterFields={['fecha_aplicacion', 'tipo_vacuna']} header={header1} emptyMessage="No se encontraron registros de aplicaciones de vacunas."
                    >
                        <Column body={numero} header="No." sortable className="table-column" />
                        <Column field="Numero" header="Ganado" sortable className="table-column" />
                        <Column field="fecha_aplicacion" body={dateVacuna} header="Fecha de Aplicación" sortable className="table-column" />
                        <Column field="tipo_vacuna" header="Tipo de Vacuna" sortable className="table-column" />
                        <Column field="dosis" header="Dosis" sortable className="table-column" />
                    </DataTable>
                </div>
            </Panel>
            <VacunasForm isVisible={isVisible} setIsVisible={setIsVisible} />
        </div>
    );
}

export default VacunasList;
