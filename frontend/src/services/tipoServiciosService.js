import axios from "axios";

export class TipoServicioService {
    url = "http://localhost:8080/tipoServicio/";

    create(tipoServicio){
        return axios.post(this.url, tipoServicio).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(tipoServicio){
        return axios.put(this.url+tipoServicio.id, tipoServicio).then(res=> res.data);
    }
    delete(id){
        return axios.delete(this.url+id).then(res=> res.data);
    }
}