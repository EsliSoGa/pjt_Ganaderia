const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query('SELECT Id_traslado, Finca_origen, Finca_destino, Fecha, Id_ganado FROM traslado',
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
    mysqlconexion.query('SELECT Id_traslado, Finca_origen, Finca_destino, Fecha, Id_ganado FROM traslado WHERE Id_traslado=?', 
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
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO traslado (Finca_origen, Finca_destino, Fecha, Id_ganado) 
	VALUES (?, ?, ?, ?);`,
        [traslado.Finca_origen, traslado.Finca_destino, traslado.Fecha, traslado.Id_ganado], 
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
    const traslado = {
        Finca_origen : req.body.Finca_origen,
        Finca_destino: req.body.Finca_destino,
        Fecha: req.body.Fecha,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE traslado SET Finca_origen=?, Finca_destino=?, Fecha=?, Id_ganado=?
    WHERE Id_traslado=?`,
    [traslado.Finca_origen, traslado.Finca_destino, traslado.Fecha, traslado.Id_ganado, id], 
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
    mysqlconexion.query('DELETE FROM traslado WHERE Id_traslado=?',[id], (error,rows,fields)=>{
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