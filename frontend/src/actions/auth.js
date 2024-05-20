import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
  } from "./type.js";
  
  import AuthService from "../services/auth.service";
  
  export const register = (Id_rol, Nombre, Correo, Contrasena) => (dispatch) => {
    return AuthService.register(Id_rol, Nombre, Correo, Contrasena).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: REGISTER_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const login = (Correo, Contrasena) => (dispatch) => {
    return AuthService.login(Correo, Contrasena).then(
      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: LOGIN_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const logout = () => (dispatch) => {
    AuthService.logout();
    AuthService.signout();
  
    dispatch({
      type: LOGOUT,
    });
  };  
  export const update = (  
    id,
    Id_rol, 
    Nombre, 
    Correo, 
    Contrasena) => {
      AuthService.update(  id,
        Id_rol, 
        Nombre, 
        Correo, 
        Contrasena);
  }