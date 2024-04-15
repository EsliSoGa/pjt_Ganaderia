import React, {useContext, useState, useEffect} from "react";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import moment from "moment";
import { BitacoraContext } from "../../context/BitacoraContext";

const BitacoraList = () =>{
    const {bitacoras} = useContext(BitacoraContext);
        
    const date = (bitacora) => {
        return moment(bitacora.Fecha).format("DD/MM/YYYY");
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
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" className="p-button-outlined" onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar" />
                </span>
            </div>
        )
    }
    const header1 = renderHeader1();

    return(
        <div>
        <Panel
            header="Bitacora" sortField="category" sortOrder={-1} responsiveLayout="scroll" 
            style={{ textAlign: "justify" }}
        >
            <div>
            <DataTable 
                value={bitacoras}
                responsiveLayout="scroll"
                selectionMode="single"
                paginator className="p-datatable-customers" showGridlines rows={10}
                dataKey="id" filters={filters1} filterDisplay="menu"
                globalFilterFields={['Accion', 'Fecha', 'Descripcion', 'Nombre']} header={header1} emptyMessage="No se encontro bitacora."
                >
                <Column field="id" header="No." sortable/>
                <Column field="Accion" header="Acción" sortable/>
                <Column field="Fecha" body={date} header="Fecha de venta" sortable/>
                <Column field="Descripcion" header="Descripción" sortable/>
                <Column field="Nombre" header="Usuario" sortable/>
            </DataTable>
            </div>
        </Panel>
        </div>
    );
}

export default BitacoraList;