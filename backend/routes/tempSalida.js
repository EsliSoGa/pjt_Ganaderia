const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero
    FROM salidas_temporal as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id`,
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
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero
    FROM salidas_temporal as s
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
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO salidas_temporal (Fecha, Motivo, Imagen, Comentarios, Id_ganado) 
	VALUES (?, ?, ?, ?, ?);`,
        [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios,  salida.Id_ganado], 
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
        Fecha : req.body.Fecha,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE salidas_temporal SET Fecha=?, Motivo=?, Imagen=?, Comentarios=?, Id_ganado=?
    WHERE id=?`,
    [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios,  salida.Id_ganado, id], 
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
    mysqlconexion.query('DELETE FROM salidas_temporal WHERE id=?',[id], (error,rows,fields)=>{
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

//Aprobación de salida
router.post('/aprobar', (req,res)=>{
    const id = req.body.id;
    mysqlconexion.query(`CALL sp_salidasAprobadas(?);`,
        [id], 
        (error,rows,fields)=>{
            if(!error){
                res.json(rows[0][0]);
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