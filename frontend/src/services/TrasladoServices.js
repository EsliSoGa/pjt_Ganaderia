import axios from "axios";

export class TrasladoService {
    url = "http://localhost:8080/traslado/";

    create(traslados){
        return axios.post(this.url, traslados).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(traslados){
        return axios.put(this.url+traslados.id, traslados).then(res=> res.data);
    }
    delete(id){
        return axios.delete(this.url+id).then(res=> res.data);
    }
}