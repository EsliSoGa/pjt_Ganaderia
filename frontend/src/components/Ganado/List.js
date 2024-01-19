import React, {useContext, useState, useEffect} from "react";
import { GanadoContext } from "../../context/GanadoContext";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import {Column} from 'primereact/column';
import Form from './Form';
import {InputText} from "primereact/inputtext";
import {Button} from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
//import { useNavigate } from "react-router-dom";
import moment from "moment";

const GanadoList = () =>{
    const {ganados, findGanado} = useContext(GanadoContext);
    
    const estadoTemplate = (ganados) => {
        return <span className={`${ganados.estado ? "activo" : "inactivo"}`}>{ganados.estado ? " Activo " : " Inactivo "}</span>;
    }
    const dateGanado = (ganados) => {
        return moment(ganados.fecha_nacimiento_vaca).format("DD/MM/YYYY");
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
                onClick={()=>setIsVisible(true)}/>
            </React.Fragment>
        )
    }

    /*const navigate = useNavigate();
    function linkRequisicion (){
        navigate('/requisicion')
    }
    function linkPedido (){
        navigate('/pedido')
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Regresar a requisición" icon="pi pi-angle-double-left" className="p-button-rounded mr-2" onClick={linkRequisicion}/>
                <Button label="Regresar a pedido" icon="pi pi-angle-double-left" className="p-button-rounded p-toolbar-separator mr-2" onClick={linkPedido}/>
            </React.Fragment>
        )
    }*/

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
        <Toolbar className="mr-2" left={leftToolbarTemplate} /*right={rightToolbarTemplate}*/></Toolbar>
        <Panel
            header="Listado del ganado" sortField="category" sortOrder={-1} responsiveLayout="scroll" 
            style={{ textAlign: "justify" }}
        >
            <div>
            <DataTable 
                value={ganados}
                responsiveLayout="scroll"
                selectionMode="single"
                onSelectionChange={(e) => saveGanado(e.value.id)}
                paginator className="p-datatable-customers" showGridlines rows={10}
                dataKey="id" filters={filters1} filterDisplay="menu"
                globalFilterFields={['nombre_ganado', 'numero_ganado', 'sexo', 'finca', 'tipo','peso', dateGanado]} header={header1} emptyMessage="No se encontraro el ganado."
                >
                <Column field="id" header="No." sortable/>
                <Column field="nombre_ganado" header="Nombre" sortable/>
                <Column field="numero_ganado" header="Número" sortable/>
                <Column field="sexo" header="Sexo" sortable/>
                <Column field="color" header="Color" sortable/>
                <Column field="peso" header="Peso" sortable/>
                <Column field="fecha_nacimiento_vaca" body={dateGanado} header="Fecha de nacimiento" sortable/>
                <Column field="tipo" header="Tipo" sortable/>
                <Column field="finca" header="Finca" sortable/>
                <Column field='estado' body={estadoTemplate} header="Estado" sortable/>
                <Column field="comentarios" header="Comentario" sortable/>
            </DataTable>
            </div>
        </Panel>
        <Form isVisible={isVisible} setIsVisible={setIsVisible}/>
        </div>
    );
}

export default GanadoList;