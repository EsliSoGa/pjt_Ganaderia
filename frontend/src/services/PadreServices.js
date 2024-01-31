import axios from "axios";

export class PadreService {
    url = "http://localhost:8080/padres/";

    create(padre){
        return axios.post(this.url, padre).then(res=> res.data);
    }
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
    readId(id){
        return axios.get(this.url+id).then(res=> res.data);
    }
    update(padre){
        return axios.put(this.url+padre.id, padre).then(res=> res.data);
    }
    delete(id){
        return axios.delete(this.url+id).then(res=> res.data);
    }
}