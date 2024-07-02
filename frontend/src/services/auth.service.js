/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const API_URL = "http://localhost:8080/usuario/";

const register = (Id_rol, Nombre, Correo, Contrasena) => {
  return axios.post(API_URL + "signup", {
    Id_rol, 
    Nombre, 
    Correo, 
    Contrasena
  });
};

const login = (Correo, Contrasena) => {
  return axios
    .post(API_URL + "signin", {
      Correo,
      Contrasena,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const signout = () => {
  return axios
  .get(API_URL + 'signout')
  .then((response) => {
    return response.data;
  });
 };

const update = (id, Id_rol, Nombre, Correo, Contrasena) => {
  return axios.put(API_URL + `${id}`, {
    Id_rol, 
    Nombre, 
    Correo, 
    Contrasena
  });
};



export default {
  login, 
  logout, 
  register,
  signout,
  update
};