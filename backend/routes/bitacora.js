const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`select b.id, Accion, Descripcion, Fecha, u.Nombre 
    FROM bitacora as b
    INNER JOIN usuario as u
    ON u.id = b.Id_usuario
    ORDER BY b.id desc`,
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

module.exports = router;