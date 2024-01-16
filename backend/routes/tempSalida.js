const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query('SELECT Id_salida, Fecha_salida, Motivo_salida, Imagen, Comentarios, Id_ganado FROM salidas_temporal',
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
    mysqlconexion.query('SELECT Id_salida, Fecha_salida, Motivo_salida, Imagen, Comentarios, Id_ganado FROM salidas_temporal WHERE Id_salida=?', 
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
        Fecha_salida : req.body.Fecha_salida,
        Motivo_salida: req.body.Motivo_salida,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO salidas_temporal (Fecha_salida, Motivo_salida, Imagen, Comentarios, Id_ganado) 
	VALUES (?, ?, ?, ?, ?);`,
        [salida.Fecha_salida, salida.Motivo_salida, salida.Imagen, salida.Comentarios,  salida.Id_ganado], 
        (error,rows,fields)=>{
            if(!error){
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
    const salida = {
        Fecha_salida : req.body.Fecha_salida,
        Motivo_salida: req.body.Motivo_salida,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE salidas_temporal SET Fecha_salida=?, Motivo_salida=?, Imagen=?, Comentarios=?, Id_ganado=?
    WHERE Id_salida=?`,
    [salida.Fecha_salida, salida.Motivo_salida, salida.Imagen, salida.Comentarios,  salida.Id_ganado, id], 
        (error,rows,fields)=>{
            if(!error){
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
    mysqlconexion.query('DELETE FROM salidas_temporal WHERE Id_salida=?',[id], (error,rows,fields)=>{
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