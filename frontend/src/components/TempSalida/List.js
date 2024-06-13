import React, {useContext, useState, useEffect} from "react";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { TempSalidaContext } from "../../context/TempSalidaContext";
import TempSalidaForm from './Form';

const TempSalidaList = () =>{
    const {tempSalidas, findTempSalida} = useContext(TempSalidaContext);
    
    const [isVisible, setIsVisible] = useState(false);
    
    const dateTempSalida = (tempSalida) => {
        return moment(tempSalida.Fecha).format("DD/MM/YYYY");
    }

    let cont = 0;

    const numero = () => {
        cont = cont++;
        return cont;
    }
    
    const saveTempSalida = (id) => {
        findTempSalida(id);
        setIsVisible(true);
    };

    const navigate = useNavigate();
    const { idTS } = useParams();

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button className="p-button-raised p-button-rounded mr-2 p-button-info" type="button" icon="pi pi-plus" label="Agregar salida" 
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
            header="Listado de salida" sortField="category" sortOrder={-1} responsiveLayout="scroll" 
            style={{ textAlign: "justify" }}
        >
            <div>
            <DataTable 
                value={tempSalidas.filter((p)=>p.Id_ganado === parseInt(idTS))}
                responsiveLayout="scroll"
                selectionMode="single"
                onSelectionChange={(e) => saveTempSalida(e.value.id)}
                paginator className="p-datatable-customers" showGridlines rows={10}
                dataKey="id" filters={filters1} filterDisplay="menu"
                globalFilterFields={['Fecha', 'Motivo']} header={header1} emptyMessage="No se encontraron salidas."
                >
                <Column body={numero} header="No." sortable/>
                <Column field="Numero" header="Ganado" sortable/>
                <Column field="Fecha" body={dateTempSalida} header="Fecha de venta" sortable/>
                <Column field="Motivo" header="Motivo" sortable/>
                <Column field="Imagen" header="Imagen" sortable/>
                <Column field="Comentarios" header="Comentarios" sortable/>
            </DataTable>
            </div>
        </Panel>
        <TempSalidaForm idTS={idTS} isVisible={isVisible} setIsVisible={setIsVisible}/>
        </div>
    );
}

export default TempSalidaList;