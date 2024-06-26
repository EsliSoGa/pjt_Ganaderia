import axios from "axios";

export class VentaService {
    url = "http://localhost:8080/venta/";

    create(ventas){
        return axios.post(this.url, ventas).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(ventas){
        return axios.put(this.url+ventas.id, ventas).then(res=> res.data);
    }
    delete(venta){
        return axios.delete(this.url+venta.id, {data: venta}).then(res=> res.data);
    }
}