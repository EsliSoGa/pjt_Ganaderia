import React, {useContext, useState, useEffect} from "react";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import { TempVentaContext } from "../../context/TempVentaContext";
import TempVentaForm from './Form';
import moment from "moment";

const TempVentaList = () =>{
    const {tempVentas, findTempVenta} = useContext(TempVentaContext);
    
    const [isVisible, setIsVisible] = useState(false);

    let cont = 0;
    const numero = () => {
        cont = cont++;
        return cont;
    }
    
    const dateTempVenta = (tempVenta) => {
        return moment(tempVenta.Fecha).format("DD/MM/YYYY");
    }

    const saveTempVenta = (id) => {
        findTempVenta(id);
        setIsVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar venta" 
                onClick={()=>setIsVisible(true)}/>
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
        <Toolbar className="mr-2" start={leftToolbarTemplate} ></Toolbar>
        <Panel
            header="Listado de ventas" sortField="category" sortOrder={-1} responsiveLayout="scroll" 
            style={{ textAlign: "justify" }}
        >
            <div>
            <DataTable 
                value={tempVentas}
                responsiveLayout="scroll"
                selectionMode="single"
                onSelectionChange={(e) => saveTempVenta(e.value.id)}
                paginator className="p-datatable-customers" showGridlines rows={10}
                dataKey="id" filters={filters1} filterDisplay="menu"
                globalFilterFields={['Fecha', 'Comprador', 'Precio', 'Peso', 'Total']} header={header1} emptyMessage="No se encontraron ventas."
                >
                <Column body={numero} header="No." sortable/>
                <Column field="Numero" header="Ganado" sortable/>
                <Column field="Fecha" body={dateTempVenta} header="Fecha de venta" sortable/>
                <Column field="Comprador" header="Comprador" sortable/>
                <Column field="Precio" header="Precio" sortable/>
                <Column field="Peso" header="Peso" sortable/>
                <Column field="Total" header="Total" sortable/>
            </DataTable>
            </div>
        </Panel>
        <TempVentaForm isVisible={isVisible} setIsVisible={setIsVisible}/>
        </div>
    );
}

export default TempVentaList;