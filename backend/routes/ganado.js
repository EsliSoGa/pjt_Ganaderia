const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT id_ganado, nombre_ganado, numero_ganado, sexo,
         color, peso, fecha_nacimiento_vaca, tipo, finca, estado,
         imagen, comentarios, id_usuario 
         FROM ganado;`,
    (error,rows,fields)=>{
        if(!error){
            res.json(rows);
        }
        else{
            console.log(error);
        }
    }) 
});

//get con ID
router.get('/:id', (req,res)=>{
    const {id} = req.params;
    mysqlconexion.query(`SELECT id_ganado, nombre_ganado, numero_ganado, sexo,
    color, peso, fecha_nacimiento_vaca, tipo, finca, estado,
    imagen, comentarios, id_usuario  
    FROM ganado WHERE id_ganado=?`, 
        [id],(error,rows,fields)=>{
        if (!error){
            res.json(rows[0]);
        }
        else{
            console.log(error);
        }
    });
});

//post
router.post('/', (req,res)=>{
    const ganado = {
        nombre_ganado: req.body.nombre_ganado,
        numero_ganado: req.body.numero_ganado,
        sexo: req.body.sexo,
        color: req.body.color,
        peso: req.body.peso,
        fecha: req.body.fecha_nacimiento_vaca,
        tipo: req.body.tipo,
        finca:req.body.finca,
        estado: req.body.estado,
        imagen: req.body.imagen,
        comentarios: req.body.comentarios,
        id_usuario: req.body.id_usuario,
    };
    mysqlconexion.query(`INSERT INTO ganado(nombre_ganado, numero_ganado, sexo, color, peso, 
        fecha_nacimiento_vaca, tipo, finca, estado, imagen, comentarios, id_usuario)
         VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ganado.nombre_ganado, ganado.numero_ganado, ganado.sexo, ganado.color, ganado.peso, ganado.fecha,
        ganado.tipo, ganado.finca, ganado.estado, ganado.imagen, ganado.comentarios, ganado.id_usuario], 
        (error,rows,fields)=>{
            if(!error){
                res.json(rows);
                console.log('Enviado');
            }
            else{
                console.log(error);
            }
    })
});

//put
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const ganado = {
        nombre_ganado: req.body.nombre_ganado,
        numero_ganado: req.body.numero_ganado,
        sexo: req.body.sexo,
        color: req.body.color,
        peso: req.body.peso,
        fecha: req.body.fecha_nacimiento_vaca,
        tipo: req.body.tipo,
        finca:req.body.finca,
        estado: req.body.estado,
        imagen: req.body.imagen,
        comentarios: req.body.comentarios,
        id_usuario: req.body.id_usuario,
    };
    mysqlconexion.query(`UPDATE ganado SET nombre_ganado=?, numero_ganado=?, sexo=?, color=?, peso=?, 
    fecha_nacimiento_vaca=?, tipo=?, finca=?, estado=?, imagen=?, comentarios=?, id_usuario=? WHERE id_ganado=?`,
        [ganado.nombre_ganado, ganado.numero_ganado, ganado.sexo, ganado.color, ganado.peso, ganado.fecha,
        ganado.tipo, ganado.finca, ganado.estado, ganado.imagen, ganado.comentarios, ganado.id_usuario, id], 
        (error,rows,fields)=>{
            if(!error){
                res.json(rows);
            }
            else{
                console.log(error);
            }
    })
});

//delete
router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    mysqlconexion.query('DELETE FROM ganado WHERE id_ganado=?',[id], (error,rows,fields)=>{
        if(!error){
            res.json(rows);
        }
        else{
            console.log(error);
        }
    })
});

module.exports = router;