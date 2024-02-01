import axios from "axios";

export class TempVentaService {
    url = "http://localhost:8080/tmpVenta/";

    create(ventas){
        return axios.post(this.url, ventas).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(ventas){
        return axios.put(this.url+ventas.id, ventas).then(res=> res.data);
    }
    delete(id){
        return axios.delete(this.url+id).then(res=> res.data);
    }
}