const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT t.id, Finca_origen, Finca_destino, t.Fecha, Id_ganado, Numero, Nombre
	FROM traslado as t
    INNER JOIN ganado as g
    on t.Id_ganado = g.id;`,
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
    mysqlconexion.query(`SELECT t.id, Finca_origen, Finca_destino, t.Fecha, Id_ganado, Numero, Nombre
	FROM traslado as t
    INNER JOIN ganado as g
    on t.Id_ganado = g.id
    where t.id = ?;`, 
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
    const traslado = {
        Finca_origen : req.body.Finca_origen,
        Finca_destino: req.body.Finca_destino,
        Fecha: req.body.Fecha,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", traslado de finca "+ req.body.Finca_origen + " a "+ req.body.Finca_destino,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`INSERT INTO traslado (Finca_origen, Finca_destino, Fecha, Id_ganado) 
	VALUES (?, ?, ?, ?);`,
        [traslado.Finca_origen, traslado.Finca_destino, traslado.Fecha, traslado.Id_ganado], 
        (error,rows,fields)=>{
            if(!error){
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) VALUES ('Crear traslado', ?, now(), ?);`,
                [traslado.descripcion, traslado.id_usuario], (error2,rows2,fields2)=>{
                    if(error2){
                        console.log(error2);
                    }
                })
                //res.json(rows);
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
    const traslado = {
        Finca_origen : req.body.Finca_origen,
        Finca_destino: req.body.Finca_destino,
        Fecha: req.body.Fecha,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", traslado de finca "+ req.body.Finca_origen + " a "+ req.body.Finca_destino,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`UPDATE traslado SET Finca_origen=?, Finca_destino=?, Fecha=?, Id_ganado=?
    WHERE id=?`,
    [traslado.Finca_origen, traslado.Finca_destino, traslado.Fecha, traslado.Id_ganado, id], 
        (error,rows,fields)=>{
            if(!error){
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) VALUES ('Editar traslado', ?, now(), ?);`,
                [traslado.descripcion, traslado.id_usuario], (error2,rows2,fields2)=>{
                    if(error2){
                        console.log(error2);
                    }
                })
                //res.json(rows);
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
    const traslado = {
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " +req.body.Numero + ", traslado de finca "+ req.body.Finca_origen + " a "+ req.body.Finca_destino,
        id_usuario: req.body.id_usuario
    }
    mysqlconexion.query('DELETE FROM traslado WHERE id=?',[id], (error,rows,fields)=>{
        if(!error){
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) VALUES ('Eliminar traslado', ?, now(), ?);`,
            [traslado.descripcion, traslado.id_usuario], (error2,rows2,fields2)=>{
                if(error2){
                    console.log(error2);
                }
            })
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

module.exports = router;