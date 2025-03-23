import axios from "axios";

export class SalidaService {
    url = "http://localhost:8080/salida/";

    create(salidas){
        return axios.post(this.url, salidas).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(salidas){
        return axios.put(this.url+salidas.id, salidas).then(res=> res.data);
    }
    delete(salida){
        return axios.delete(this.url+salida.id, {data:salida}).then(res=> res.data);
    }
}