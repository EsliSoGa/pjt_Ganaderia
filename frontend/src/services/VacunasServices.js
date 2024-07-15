import axios from "axios";

export class VacunasService {
    url = "http://localhost:8080/vacunas/";

    create(vacuna){
        return axios.post(this.url, vacuna).then(res => res.data);
    }
    readAll(){
        return axios.get(this.url).then(res => res.data);
    }
    update(vacuna){
        return axios.put(this.url + vacuna.id, vacuna).then(res => res.data);
    }
    delete(vacuna){
        return axios.delete(this.url + vacuna.id, {data: vacuna}).then(res => res.data);
    }
}
