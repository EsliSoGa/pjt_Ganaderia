import axios from "axios";

export class LecheService {
    url = "http://localhost:8080/leche/";

    create(leche){
        return axios.post(this.url, leche).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    update(leche){
        return axios.put(this.url+leche.id, leche).then(res=> res.data);
    }
    delete(leche){
        return axios.delete(this.url+leche.id, {data:leche}).then(res=> res.data);
    }
}
