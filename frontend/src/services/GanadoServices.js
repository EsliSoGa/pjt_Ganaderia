import axios from "axios";

export class GanadoService {
    url = "http://localhost:8080/ganado/";

    create(ganado){
        return axios.post(this.url, ganado).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(ganado){
        return axios.put(this.url+ganado.id, ganado).then(res=> res.data);
    }
    delete(ganado){
        return axios.delete(this.url+ganado.id, {data: ganado}).then(res=> res.data);
    }
}