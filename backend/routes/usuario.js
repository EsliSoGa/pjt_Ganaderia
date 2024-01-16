const express = require('express');
const router = express.Router();
const mysql = require('../db');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const utils = require('../utils');

router.post('/signup', expressAsyncHandler(async(req, res) => {
    const password = req.body.contrasena;    
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const nuevo = {
        idRol: req.body.id_rol,
        nombre: req.body.nombre_usuario,
        correo: req.body.correo,
        password: encryptedPassword
    };
    mysql.query('INSERT INTO usuario(nombre_usuario, contrasena, id_rol, correo)  VALUES (?, ?, ?, ?)', 
    [ nuevo.nombre, nuevo.password, nuevo.idRol, nuevo.correo], 
    async function(error, results, fields) {
        if (error) {        
            res.send({          
            code:400,          
            failed:"error occurred",          
            error : error});   
        } else {
            res.send({          
                code:200,          
                success:"Usuario registrado correctamente",
                nombre: nuevo.idRol,
                correo: nuevo.correo
            });
        }
    });
}));

router.post('/in', expressAsyncHandler(async(req, res) => {
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    mysql.query("SELECT id_usuario, rol, nombre_usuario, correo, contrasena"
    + " FROM usuario as u"  
    + " INNER JOIN roles as r " 
    + "ON u.id_rol = r.id_rol "
    + "WHERE u.correo = ?; ", [correo], async function(error, results, fields){
        if (error) {        
                res.send({
                code:400,          
                failed:"Ocurre un error",          
                error : error        
                });      
        }else{        
            if(results.length > 0){
                const compare = await bcrypt.compare(contrasena, results[0].contrasena)
                if(compare){
                    const user = {
                        id_usuario: results[0].id_usuario,
                        rol: results[0].rol,
                        nombre_usuario: results[0].nombre_usuario,
                        correo: results[0].correo
                    };
                    const token = utils(user);
                    req.session.token = token;
                    res.send({
                        code:200,
                        success:"Inicio de sesión correctamente",
                        id_usuario: results[0].id_usuario,
                        rol: results[0].rol,
                        nombre_usuario: results[0].nombre_usuario,
                        correo: results[0].correo,
                        token: token
                    });
                }else{
                    res.send({code:204, error:"El correo y la contraseña no coinciden"});
                }
            }else {
                res.send({"code":206, "error":"El correo no existe"});
            }
        }
    });
}));

router.post('/create', expressAsyncHandler(async(req, res) => {
    const contrasena = req.body.contrasena;    
    const encryptedPassword = bcrypt.hashSync(contrasena, 10);
    const nuevo = {
        id_rol: req.body.id_rol,
        nombre: req.body.nombre_usuario,
        correo: req.body.correo,
        contrasena: encryptedPassword
    };
    mysql.query('INSERT INTO usuario(nombre_usuario, contrasena, id_rol, correo) VALUES (?, ?, ?, ?)', 
    [nuevo.nombre, nuevo.contrasena, nuevo.id_rol, nuevo.correo], 
    async function(error, results, fields) {
        if (error) {        
                res.send({          
                code:400,          
                failed:"error occurred",          
                error : error});   
            } else {
                res.send({          
                    code:200,          
                    success:"Usuario registrado correctamente",
                    nombre: nuevo.idRol,
                    correo: nuevo.correo
                });
            }});
}));

router.get('/', expressAsyncHandler(async(req, res) => {
    mysql.query(`SELECT id_usuario, nombre_usuario, contrasena, correo, rol 
    FROM usuario u 
    INNER JOIN roles AS r 
    ON U.id_rol = R.id_rol`, async (error, rows, fields) => {
        if(error){
            res.send({message: "Error"});
        } else {
            res.json(rows);
        }
    })
}));

router.get('/:id', expressAsyncHandler(async(req, res) => {
    const { id } = req.params; 
    mysql.query(`SELECT id_usuario, nombre_usuario, contrasena, correo, rol 
    FROM usuario u 
    INNER JOIN roles AS r 
    ON U.id_rol = R.id_rol WHERE id_usuario = ?`, [id] ,async (error, rows, fields) => {
        if(error){
            res.send({message: "Error"});
        } else {
            res.json(rows[0]);
        }
    })
}));

router.put('/:id', expressAsyncHandler(async(req, res) => {
    const { id } = req.params;
    const contrasena = req.body.contrasena;    
    const encryptedPassword = bcrypt.hashSync(contrasena, 10)
    const nuevo = {
        idRol: req.body.id_rol,
        nombre: req.body.nombre_usuario,
        correo: req.body.correo,
        password: encryptedPassword
    };
    mysql.query(`UPDATE usuario SET id_rol = ?, nombre_usuario = ?, correo=?, contrasena=?
                WHERE id_usuario = ?`, 
    [nuevo.idRol, nuevo.nombre, nuevo.correo, nuevo.password, id], async function(error, rows, fields){
        if (error) {        
            res.send({          
            code:400,          
            failed:"Error al actualizar",          
            error : error})      
        } else {        
            res.json(rows);
        }

    });
}));

router.delete('/:id', expressAsyncHandler(async(req, res) => {
    const { id } = req.params;
    mysql.query('DELETE FROM usuario WHERE id_usuario = ?',[id], async function(error, rows, fields){
        if(error){
            res.send({code: 400, failed: "Error en eliminar"});
        }else{
            res.send({code: 200, success: "Usuario eliminado"})
        }
    })
}));

router.post('/out', expressAsyncHandler(async(req, res) => {
    req.session = null;
    res.redirect('/'); 
}));

module.exports = router;