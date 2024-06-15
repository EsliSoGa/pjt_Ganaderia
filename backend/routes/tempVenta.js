const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT v.id, v.Fecha, Comprador, Precio, v.Peso, Total, Id_ganado, g.Numero
    FROM venta_temporal as v
    INNER JOIN ganado as g
    on v.Id_ganado = g.id`,
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
    mysqlconexion.query(`SELECT v.id, v.Fecha, Comprador, Precio, v.Peso, Total, Id_ganado, g.Numero
    FROM venta_temporal as v
    INNER JOIN ganado as g
    on v.Id_ganado = g.id WHERE v.id=?`, 
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
    const venta = {
        Fecha : req.body.Fecha,
        Comprador: req.body.Comprador,
        Precio: req.body.Precio,
        Peso: req.body.Peso,
        Total: req.body.Total,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO venta_temporal (Fecha, Comprador, Precio, Peso, Total, Id_ganado)
	VALUES (?, ?, ?, ?, ?, ?);`,
        [venta.Fecha, venta.Comprador, venta.Precio, venta.Peso, venta.Total, venta.Id_ganado], 
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
    const venta = {
        Fecha : req.body.Fecha,
        Comprador: req.body.Comprador,
        Precio: req.body.Precio,
        Peso: req.body.Peso,
        Total: req.body.Total,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE venta_temporal SET Fecha=?, Comprador=?, Precio=?, Peso=?, Total=?, Id_ganado=?
    WHERE id=?`,
    [venta.Fecha, venta.Comprador, venta.Precio, venta.Peso, venta.Total, venta.Id_ganado, id], 
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
    mysqlconexion.query('DELETE FROM venta_temporal WHERE id=?',[id], (error,rows,fields)=>{
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

//Aprobación de venta
router.post('/aprobar', (req,res)=>{
    const venta = {
        id: req.body.id,
        idUsuario: req.body.id_usuario
    };
    mysqlconexion.query(`CALL sp_ventaAprobadas(?, ?);`,
        [venta.id, venta.idUsuario], 
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