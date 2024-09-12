const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT s.id, s.Fecha, Condicion, Edad, comentario, id_ganado, id_tipo_servicio, Nombre_tipo, Numero, Nombre
    FROM servicios as s
    INNER JOIN tipo_servicio as t
    ON s.id_tipo_servicio = t.id
    INNER JOIN ganado as g
    ON s.id_ganado = g.id;`,
    (error,rows,fields)=>{
        if(!error){
            res.json(rows);
        }
        else{
            console.log(error);
            res.send({
                code:400,
                failed:"error occurred",
                error : error});
        }
    }) 
});

//get con ID
router.get('/:id', (req,res)=>{
    const {id} = req.params;
    mysqlconexion.query('SELECT id, Fecha, Condicion, Edad, comentario, id_ganado, id_tipo_servicio FROM servicios WHERE id=?', 
        [id],(error,rows,fields)=>{
        if (!error){
            res.json(rows[0]);
        }
        else{
            console.log(error);
            res.send({
                code:400,
                failed:"error occurred",
                error : error});
        }
    });
});

//post
router.post('/', (req,res)=>{
    const servicio = {
        fecha : req.body.Fecha,
        condicion: req.body.Condicion,
        edad: req.body.Edad,
        comentario: req.body.comentario,
        idganado: req.body.id_ganado,
        tipo: req.body.id_tipo_servicio,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", tipo de servicio "+ req.body.Nombre_tipo + ", Fecha: " + req.body.Fecha+", Condición: "+req.body.Condicion+", Edad:"+req.body.Edad,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`INSERT INTO servicios (Fecha, Condicion, Edad, comentario, id_ganado, id_tipo_servicio)
	VALUES (?, ?, ?, ?, ?, ?);`,
        [servicio.fecha, servicio.condicion, servicio.edad, servicio.comentario, servicio.idganado, servicio.tipo], 
        (error,rows,fields)=>{
            if(!error){
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Creación de servicio', ?, now(), ?);`,
                [servicio.descripcion, servicio.id_usuario], (error2,rows2,fields2)=>{
                    if(error2){
                        console.log(error2);
                    }
                })
                console.log('Enviado');
                res.send({
                    code:200,
                    success:"Servicio registrado correctamente",
                });
            }
            else{
                console.log(error);
                res.send({
                    code:400,
                    failed:"error occurred",
                    error : error});
            }
    })
});

//put
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const servicio = {
        fecha : req.body.Fecha,
        condicion: req.body.Condicion,
        edad: req.body.Edad,
        comentario: req.body.comentario,
        idganado: req.body.id_ganado,
        tipo: req.body.id_tipo_servicio,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", tipo de servicio "+ req.body.Nombre_tipo + ", Fecha: " + req.body.Fecha+", Condición: "+req.body.Condicion+", Edad:"+req.body.Edad,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`UPDATE servicios SET Fecha=?, Condicion=?, Edad=?, comentario=?, id_ganado=?, id_tipo_servicio=? 
    WHERE id=?`,
        [servicio.fecha, servicio.condicion, servicio.edad, servicio.comentario, servicio.idganado, servicio.tipo, id], 
        (error,rows,fields)=>{
            if(!error){
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Actualización de servicio', ?, now(), ?);`,
                [servicio.descripcion, servicio.id_usuario], (error2,rows2,fields2)=>{
                    if(error2){
                        console.log(error2);
                    }
                })
                res.send({
                    code:200,
                    success:"Servicio actualizado correctamente",
                });
            }
            else{
                console.log(error);
                res.send({
                    code:400,
                    failed:"error occurred",
                    error : error});
            }
    })
});

//delete
router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    const servicio = {
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", tipo servicio "+ req.body.Nombre_tipo + ", Fecha: " + req.body.Fecha+", Condición: "+req.body.Condicion+", Edad:"+req.body.Edad,
        id_usuario: req.body.id_usuario
    }
    mysqlconexion.query('DELETE FROM servicios WHERE id=?',[id], (error,rows,fields)=>{
        if(!error){
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
            VALUES ('Eliminar servicio', ?, now(), ?);`,
            [servicio.descripcion, servicio.id_usuario], (error2,rows2,fields2)=>{
                if(error2){
                    console.log(error2);
                }
            })
            res.send({
                code:200,
                success:"Eliminado correctamente",
            });
        }
        else{
            console.log(error);
            res.send({
                code:400,
                failed:"error occurred",
                error : error});
        }
    })
});

module.exports = router;
