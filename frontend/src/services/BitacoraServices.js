import axios from "axios";

export class BitacoraService {
    url = "http://localhost:8080/bitacora/";

    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
}