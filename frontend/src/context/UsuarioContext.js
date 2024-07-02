import React, {createContext, useState, useEffect, useMemo } from "react";
import { RolService, UsuarioService } from "../services/UsuarioServicio"

export const UsuarioContext = createContext();

const UsuarioContextProvider = (props)=>{
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const rolService = useMemo(() => new RolService(), []);
    
    const [usuarios, setUsuarios] = useState([]);
    const [rol, setRol] = useState([]);
    const [editUsuarios, setEditUsuarios] = useState(null);

    useEffect(() => {
        usuarioService.readAll().then((data) => setUsuarios(data));
        rolService.readAll().then((data) => setRol(data));
    }, [usuarioService, rolService]);

    const createUsuario =(usuario)=>{
        usuarioService
            .create(usuario)
            .then((data)=>setUsuarios([...usuarios, data]));
    };

    const deleteUsuario =(usuario)=>{
        usuarioService
            .delete(usuario)
            .then(()=>setUsuarios(usuarios.filter((p)=>p.id !== usuario.id)));
    };
    
    const findUsuario =(id)=>{
        const usuario = usuarios.find((p)=>p.id === id);
        setEditUsuarios(usuario);
    };
    
    const updateUsuario =(usuario)=>{
        usuarioService
        .update(usuario)
        .then((data)=>
            setUsuarios(
                usuarios.map((p)=>(p.id === usuario.id ? data: usuario))
            )
        );
        setEditUsuarios(null);
    };

    const changePassUsuario =(usuario)=>{
        usuarioService
        .changePass(usuario)
        .then((data)=>
            setUsuarios(
                usuarios.map((p)=>(p.id === usuario.id ? data: usuario))
            )
        );
        setEditUsuarios(null);
    };


    return(
        <UsuarioContext.Provider 
            value={{
                createUsuario,
                deleteUsuario,
                findUsuario,
                updateUsuario,
                changePassUsuario,
                editUsuarios,
                rol,
                usuarios,
            }}>
            {props.children}
        </UsuarioContext.Provider>
    );
};
export default UsuarioContextProvider;