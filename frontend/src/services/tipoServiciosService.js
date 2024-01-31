import axios from "axios";

export class TipoServicioService {
    url = "http://localhost:8080/tipoServicio/";
    
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
}