const express = require('express');
const router = express.Router();
const mysql = require('../db');
const bcrypt = require('bcrypt');
const expressAsyncHandler = require('express-async-handler');
const utils = require('../utils');

router.post('/signup', expressAsyncHandler(async(req, res) => {
    const password = req.body.Contrasena;    
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const nuevo = {
        idRol: req.body.Id_rol,
        Nombre: req.body.Nombre,
        Correo: req.body.Correo,
        password: encryptedPassword
    };
    mysql.query('INSERT INTO usuario(Nombre, Contrasena, Id_rol, Correo)  VALUES (?, ?, ?, ?)', 
    [ nuevo.Nombre, nuevo.password, nuevo.idRol, nuevo.Correo], 
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
                Nombre: nuevo.idRol,
                Correo: nuevo.Correo
            });
        }
    });
}));

router.post('/signin', expressAsyncHandler(async(req, res) => {
    const Correo = req.body.Correo;
    const Contrasena = req.body.Contrasena;
    mysql.query("SELECT u.id, rol, Nombre, Correo, Contrasena"
    + " FROM usuario as u"  
    + " INNER JOIN roles as r " 
    + "ON u.Id_rol = r.id "
    + "WHERE u.Correo = ?; ", [Correo], async function(error, results, fields){
        if (error) {        
                res.send({
                code:400,          
                failed:"Ocurre un error",          
                error : error        
                });      
        }else{        
            if(results.length > 0){
                const compare = await bcrypt.compare(Contrasena, results[0].Contrasena)
                if(compare){
                    const user = {
                        id: results[0].id,
                        rol: results[0].rol,
                        Nombre: results[0].Nombre,
                        Correo: results[0].Correo
                    };
                    const token = utils(user);
                    req.session.token = token;
                    res.send({
                        code:200,
                        success:"Inicio de sesión correctamente",
                        id: results[0].id,
                        rol: results[0].rol,
                        Nombre: results[0].Nombre,
                        Correo: results[0].Correo,
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
    const Contrasena = req.body.Contrasena;    
    const encryptedPassword = bcrypt.hashSync(Contrasena, 10);
    const nuevo = {
        Id_rol: req.body.Id_rol,
        Nombre: req.body.Nombre,
        Correo: req.body.Correo,
        Contrasena: encryptedPassword
    };
    mysql.query('INSERT INTO usuario(Nombre, Contrasena, Id_rol, Correo) VALUES (?, ?, ?, ?)', 
    [nuevo.Nombre, nuevo.Contrasena, nuevo.Id_rol, nuevo.Correo], 
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
                    Nombre: nuevo.idRol,
                    Correo: nuevo.Correo
                });
            }});
}));

router.get('/', expressAsyncHandler(async(req, res) => {
    mysql.query(`SELECT id, Nombre, Contrasena, Correo, rol 
    FROM usuario u 
    INNER JOIN roles AS r 
    ON U.Id_rol = R.id`, async (error, rows, fields) => {
        if(error){
            res.send({message: "Error"});
        } else {
            res.json(rows);
        }
    })
}));

router.get('/:id', expressAsyncHandler(async(req, res) => {
    const { id } = req.params; 
    mysql.query(`SELECT id, Nombre, Contrasena, Correo, rol 
    FROM usuario u 
    INNER JOIN roles AS r 
    ON U.Id_rol = R.id WHERE id = ?`, [id] ,async (error, rows, fields) => {
        if(error){
            res.send({message: "Error"});
        } else {
            res.json(rows[0]);
        }
    })
}));

router.put('/update/:id', expressAsyncHandler(async(req, res) => {
    const { id } = req.params;
    const Contrasena = req.body.Contrasena;    
    const encryptedPassword = bcrypt.hashSync(Contrasena, 10)
    const nuevo = {
        idRol: req.body.Id_rol,
        Nombre: req.body.Nombre,
        Correo: req.body.Correo,
        password: encryptedPassword
    };
    mysql.query(`UPDATE usuario SET Id_rol = ?, Nombre = ?, Correo=?, Contrasena=?
                WHERE id = ?`, 
    [nuevo.idRol, nuevo.Nombre, nuevo.Correo, nuevo.password, id], async function(error, rows, fields){
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
    mysql.query('DELETE FROM usuario WHERE id = ?',[id], async function(error, rows, fields){
        if(error){
            res.send({code: 400, failed: "Error en eliminar"});
        }else{
            res.send({code: 200, success: "Usuario eliminado"})
        }
    })
}));

router.post('/signout', expressAsyncHandler(async(req, res) => {
    req.session = null;
    res.redirect('/'); 
}));

module.exports = router;