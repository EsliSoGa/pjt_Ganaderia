const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query('SELECT Id_leche, Fecha, Produccion_diaria, Id_ganado FROM Leche;',
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
    mysqlconexion.query('select Id_leche, Fecha, Produccion_diaria, Id_ganado FROM Leche WHERE Id_leche=?', 
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
    const leche = {
        fecha: req.body.Fecha,
        produccion: req.body.Produccion_diaria,
        ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO leche(Fecha, Produccion_diaria, Id_ganado) VALUE (?, ?, ?)`,
        [leche.fecha, leche.produccion, leche.ganado], 
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
    const leche = {
        fecha: req.body.Fecha,
        produccion: req.body.Produccion_diaria,
        ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE leche SET Fecha=?, Produccion_diaria=?, Id_ganado=? WHERE Id_leche=?`,
        [leche.fecha, leche.produccion, leche.ganado, id], 
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
    mysqlconexion.query('DELETE FROM leche WHERE Id_leche=?',[id], (error,rows,fields)=>{
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