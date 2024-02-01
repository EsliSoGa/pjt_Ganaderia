import axios from "axios";

export class TempSalidaService {
    url = "http://localhost:8080/tmpSalida/";

    create(salidas){
        return axios.post(this.url, salidas).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(salidas){
        return axios.put(this.url+salidas.id, salidas).then(res=> res.data);
    }
    delete(id){
        return axios.delete(this.url+id).then(res=> res.data);
    }
}