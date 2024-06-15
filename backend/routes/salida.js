const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero, g.Nombre
    FROM salidas as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id
    ORDER BY s.id desc`,
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
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero, g.Nombre
    FROM salidas as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id WHERE s.id=?`, 
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
    const salida = {
        Fecha : req.body.Fecha,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", por: "+ req.body.Motivo + ". Comentarios: "+ req.body.Comentarios,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`INSERT INTO salidas (Fecha, Motivo, Imagen, Comentarios, Id_ganado) 
	VALUES (?, ?, ?, ?, ?);`,
        [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios,  salida.Id_ganado], 
        (error,rows,fields)=>{
            if(!error){
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Crear salida', ?, now(), ?);`,
                [salida.descripcion, salida.id_usuario], (error2,rows2,fields2)=>{
                    if(error2){
                        console.log(error2);
                    }
                })
                console.log('Enviado');
                res.send({
                    code:200,
                    success:"Registrado correctamente",
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
    const salida = {
        Fecha : req.body.Fecha,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", por: "+ req.body.Motivo + ". Comentarios: "+ req.body.Comentarios,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`UPDATE salidas SET Fecha=?, Motivo=?, Imagen=?, Comentarios=?, Id_ganado=?
    WHERE id=?`,
    [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios,  salida.Id_ganado, id], 
        (error,rows,fields)=>{
            if(!error){
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Actualización de salida', ?, now(), ?);`,
                [salida.descripcion, salida.id_usuario], (error2,rows2,fields2)=>{
                    if(error2){
                        console.log(error2);
                    }
                })
                res.send({
                    code:200,
                    success:"Actualizado correctamente",
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
    const salida ={
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", por: "+ req.body.Motivo + ". Comentarios: "+ req.body.Comentarios,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query('DELETE FROM salidas WHERE id=?',[id], (error,rows,fields)=>{
        if(!error){
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
            VALUES ('Eliminación de salida', ?, now(), ?);`,
                [salida.descripcion, salida.id_usuario], (error2,rows2,fields2)=>{
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