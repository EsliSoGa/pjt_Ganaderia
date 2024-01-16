const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query('SELECT Id_servicio, Fecha_servicio, Condicion, Edad_ternero_gestante, comentario, id_ganado, id_tipo_servicio FROM servicios;',
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
    mysqlconexion.query('SELECT Id_servicio, Fecha_servicio, Condicion, Edad_ternero_gestante, comentario, id_ganado, id_tipo_servicio FROM servicios WHERE Id_servicio=?', 
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
        fechaServicio : req.body.Fecha_servicio,
        condicion: req.body.Condicion,
        edad_ternero: req.body.Edad_ternero_gestante,
        comentario: req.body.comentario,
        idganado: req.body.id_ganado,
        tipo: req.body.id_tipo_servicio
    };
    mysqlconexion.query(`INSERT INTO servicios (Fecha_servicio, Condicion, Edad_ternero_gestante, comentario, id_ganado, id_tipo_servicio)
	VALUES (?, ?, ?, ?, ?, ?);`,
        [servicio.fechaServicio, servicio.condicion, servicio.edad_ternero, servicio.comentario, servicio.idganado, servicio.tipo], 
        (error,rows,fields)=>{
            if(!error){
                //res.json(rows);
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
        fechaServicio : req.body.Fecha_servicio,
        condicion: req.body.Condicion,
        edad_ternero: req.body.Edad_ternero_gestante,
        comentario: req.body.comentario,
        idganado: req.body.id_ganado,
        tipo: req.body.id_tipo_servicio
    };
    mysqlconexion.query(`UPDATE servicios SET Fecha_servicio=?, Condicion=?, Edad_ternero_gestante=?, comentario=?, id_ganado=?, id_tipo_servicio=? 
    WHERE Id_servicio=?`,
        [servicio.fechaServicio, servicio.condicion, servicio.edad_ternero, servicio.comentario, servicio.idganado, servicio.tipo, id], 
        (error,rows,fields)=>{
            if(!error){
                //res.json(rows);
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
    mysqlconexion.query('DELETE FROM servicios WHERE Id_servicio=?',[id], (error,rows,fields)=>{
        if(!error){
            //res.json(rows);
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