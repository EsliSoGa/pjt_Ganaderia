const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query('SELECT id, Id_ganado_madre, Tipo_nacimiento, Id_ganado_padre, Id_ganado_hijo FROM relacion_padres',
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
    mysqlconexion.query('SELECT id, Id_ganado_madre, Tipo_nacimiento, Id_ganado_padre, Id_ganado_hijo FROM relacion_padres WHERE id=?', 
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
    const relacion = {
        madre : req.body.Id_ganado_madre,
        nacimiento: req.body.Tipo_nacimiento,
        padre: req.body.Id_ganado_padre,
        hijo: req.body.Id_ganado_hijo
    };
    mysqlconexion.query(`INSERT INTO relacion_padres (Id_ganado_madre, Tipo_nacimiento, Id_ganado_padre, Id_ganado_hijo)
	VALUES (?, ?, ?, ?);`,
        [relacion.madre, relacion.nacimiento, relacion.padre, relacion.hijo], 
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
    const relacion = {
        madre : req.body.Id_ganado_madre,
        nacimiento: req.body.Tipo_nacimiento,
        padre: req.body.Id_ganado_padre,
        hijo: req.body.Id_ganado_hijo
    };
    mysqlconexion.query(`UPDATE relacion_padres SET Id_ganado_madre=?, Tipo_nacimiento=?, Id_ganado_padre=?, Id_ganado_hijo=?
    WHERE id=?`,
        [relacion.madre, relacion.nacimiento, relacion.padre, relacion.hijo, id], 
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
    mysqlconexion.query('DELETE FROM relacion_padres WHERE id=?',[id], (error,rows,fields)=>{
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