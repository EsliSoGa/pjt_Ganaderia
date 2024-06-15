import axios from "axios";

export class UsuarioService {
    url = "http://localhost:8080/usuario/";

    create(usuario){
        return axios.post(this.url + "create", usuario).then(res => res.data);
    }
    readAll(){
        return axios.get(this.url).then(res => res.data);
    }
    update(usuario){
        return axios.put(this.url + "update/" + usuario.id, usuario).then(res => res.data);
    }
    delete(id){
        return axios.delete(this.url + id).then(res => res.data);
    }
}