import axios from "axios";

export class ServicioService {
    url = "http://localhost:8080/servicio/";

    create(servicios){
        return axios.post(this.url, servicios).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(servicios){
        return axios.put(this.url+servicios.id, servicios).then(res=> res.data);
    }
    delete(servicio){
        return axios.delete(this.url+servicio.id, {data: servicio}).then(res=> res.data);
    }
}