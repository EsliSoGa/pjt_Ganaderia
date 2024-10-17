import React, { useContext, useState, useEffect, useRef } from "react";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import moment from "moment";
import { LecheContext } from "../../context/LecheContext";
import LecheForm from './LecheForm';
import { Toast } from 'primereact/toast';
import '../SharedTableStyles.css'; // Importamos el archivo CSS general

const LecheList = () => {
    const { leches, findLeche, ganados } = useContext(LecheContext);
    const [filteredLeches, setFilteredLeches] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        // Al iniciar, combinar leches con ganados
        if (leches && ganados) {
            const lechesWithGanado = leches.map(leche => {
                const ganado = ganados.find(g => g.id === leche.Id_ganado);
                return { ...leche, ganado };
            });
            setFilteredLeches(lechesWithGanado); // Inicialmente mostrar todas las leches
        }
    }, [leches, ganados]);

    let cont = 0;

    const dateLeche = (leche) => {
        return moment(leche.Fecha).format("DD/MM/YYYY");
    }

    const numero = () => {
        cont = cont + 1;
        return cont;
    }

    const saveLeche = (id) => {
        findLeche(id);
        setIsVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar leche"
                    onClick={() => setIsVisible(true)} />
            </React.Fragment>
        )
    }

    // Filtro
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
            <Toast ref={toast} position="top-center"></Toast>
            <Toolbar className="mr-2" start={leftToolbarTemplate}></Toolbar>
            <Panel header="Listado de producción de leche" className="table-panel">
                <div className="table-datatable">
                    <DataTable
                        value={filteredLeches}
                        responsiveLayout="scroll"
                        selectionMode="single"
                        onSelectionChange={(e) => saveLeche(e.value.id)}
                        paginator className="p-datatable-customers" showGridlines rows={10}
                        dataKey="id" filters={filters1} filterDisplay="menu"
                        globalFilterFields={['Fecha', 'Produccion_diaria']} header={header1} emptyMessage="No se encontraron registros de producción de leche."
                    >
                        <Column body={numero} header="No." sortable className="table-column" />
                        <Column field="Numero" header="Ganado" sortable className="table-column" />
                        <Column field="Fecha" body={dateLeche} header="Fecha de producción" sortable className="table-column" />
                        <Column field="Produccion_diaria" header="Producción semanal" sortable className="table-column" />
                        <Column field="ganado.finca" header="Finca" sortable className="table-column" />
                    </DataTable>
                </div>
            </Panel>
            <LecheForm isVisible={isVisible} setIsVisible={setIsVisible} />
        </div>
    );
}

export default LecheList;
