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
    changePass(usuario){
        return axios.put(this.url + "changePass/" + usuario.id, usuario).then(res => res.data);
    }
    delete(usuario){
        return axios.delete(this.url + usuario.id, {data: usuario}).then(res => res.data);
    }
}

export class RolService {
    url = "http://localhost:8080/rol";
    
    readAll(){
        return axios.get(this.url).then(res=> res.data);
    }
}