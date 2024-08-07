import React, { useContext, useState, useEffect } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import '../SharedTableStyles.css'; // Asegúrate de importar el archivo CSS general
import Form from "./Form";
import ChangePassForm from "./FormChangePass";

const UsuarioList = () => {
    const { usuarios, findUsuario, getUsuario } = useContext(UsuarioContext);

    const [isVisible, setIsVisible] = useState(false);
    const [refreshList, setRefreshList] = useState(false);

    useEffect(() => {
        getUsuario()
    }, [refreshList])

    let cont = 0;

    const numeroCont = () => {
        cont = cont++;
        return cont;
    }

    const saveUsuario = (id) => {
        findUsuario(id);
        setIsVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar usuario"
                    onClick={() => setIsVisible(true)} />
            </React.Fragment>
        )
    }

    // Filtro
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

    const titulo = () => {
        return <span>{'Listado de usuarios '}</span>;
    };

    return (
        <div className="table-container">
            <Toolbar className="mr-2" start={leftToolbarTemplate}></Toolbar>
            <Panel header={titulo} className="table-panel">
                <div className="table-datatable">
                    <DataTable
                        value={usuarios}
                        responsiveLayout="scroll"
                        selectionMode="single"
                        onSelectionChange={(e) => saveUsuario(e.value.id)}
                        paginator className="p-datatable-customers" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"
                        globalFilterFields={['Nombre', 'Correo']} header={header1} emptyMessage="No se encontraron usuario."
                    >
                        <Column body={numeroCont} header="No." sortable className="table-column" />
                        <Column field="Nombre" header="Nombre" sortable className="table-column" />
                        <Column field="Correo" header="Correo electronico" sortable className="table-column" />
                        <Column field="rol" header="Rol de usuario" sortable className="table-column" />
                    </DataTable>
                </div>
            </Panel>
            <Form isVisible={isVisible} setIsVisible={setIsVisible} setRefresh={() => setRefreshList(!refreshList)} />
        </div>
    );
}

export default UsuarioList;
