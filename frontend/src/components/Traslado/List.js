import React, {useContext, useState, useEffect} from "react";
import { TrasladoContext } from "../../context/TrasladoContext";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate, useParams } from "react-router-dom";
import TrasladoForm from './Form';
import moment from "moment";

const TrasladoList = () =>{
    const {traslados, findTraslado} = useContext(TrasladoContext);
    
    const [isVisible, setIsVisible] = useState(false);

    let cont = 0;

    const numero = () => {
        cont = cont+0.5;
        return cont;
    }

    const dateTraslado = (traslado) => {
        return moment(traslado.Fecha).format("DD/MM/YYYY");
    }

    const saveTraslado = (id) => {
        findTraslado(id);
        setIsVisible(true);
    };

    const navigate = useNavigate();
    const { idT } = useParams();

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar traslado" 
                onClick={()=>setIsVisible(true)}/>
            </React.Fragment>
        )
    }

    function linkGanado (){
        navigate('/ganado')
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Regresar a ganado" icon="pi pi-angle-double-left" className="p-button-rounded mr-2" onClick={linkGanado}/>
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
        <Toolbar className="mr-2" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
        <Panel
            header="Listado de traslados" sortField="category" sortOrder={-1} responsiveLayout="scroll" 
            style={{ textAlign: "justify" }}
        >
            <div>
            <DataTable 
                value={traslados.filter((p)=>p.Id_ganado === parseInt(idT))}
                responsiveLayout="scroll"
                selectionMode="single"
                onSelectionChange={(e) => saveTraslado(e.value.id)}
                paginator className="p-datatable-customers" showGridlines rows={10}
                dataKey="id" filters={filters1} filterDisplay="menu"
                globalFilterFields={['Fecha', 'Finca_origen', 'Finca_destino']} header={header1} emptyMessage="No se encontraron traslados."
                >
                <Column body={numero} header="No." sortable/>
                <Column field="Numero" header="Ganado" sortable/>
                <Column field="Fecha" body={dateTraslado} header="Fecha de traslado" sortable/>
                <Column field="Finca_origen" header="Finca origen" sortable/>
                <Column field="Finca_destino" header="Finca destino" sortable/>
            </DataTable>
            </div>
        </Panel>
        <TrasladoForm idT={idT} isVisible={isVisible} setIsVisible={setIsVisible}/>
        </div>
    );
}

export default TrasladoList;