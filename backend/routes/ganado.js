const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

//get
router.get('/',(req,res)=>{
    mysqlconexion.query(`SELECT g.id, nombre, numero, sexo,
    color, peso, fecha, tipo, finca, estado,
    imagen, comentarios, id_usuario,
    (SELECT numero from ganado where id = id_ganado_madre) as madre,
    (SELECT numero from ganado where id = id_ganado_padre) as padre, 
    tipo_nacimiento
    FROM ganado as g
    left JOIN relacion_padres as r
    ON Id_ganado_hijo = g.id;`,
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
    mysqlconexion.query(`SELECT id, nombre, numero, sexo,
    color, peso, fecha, tipo, finca, estado,
    imagen, comentarios, id_usuario  
    FROM ganado WHERE id=?`, 
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
        nombre: req.body.nombre,
        numero: req.body.numero,
        sexo: req.body.sexo,
        color: req.body.color,
        peso: req.body.peso,
        fecha: req.body.fecha,
        tipo: req.body.tipo,
        finca:req.body.finca,
        estado: req.body.estado,
        imagen: req.body.imagen,
        comentarios: req.body.comentarios,
        id_usuario: req.body.id_usuario,
    };
    mysqlconexion.query(`INSERT INTO ganado(nombre, numero, sexo, color, peso, 
        fecha, tipo, finca, estado, imagen, comentarios, id_usuario)
         VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ganado.nombre, ganado.numero, ganado.sexo, ganado.color, ganado.peso, ganado.fecha,
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
        nombre: req.body.nombre,
        numero: req.body.numero,
        sexo: req.body.sexo,
        color: req.body.color,
        peso: req.body.peso,
        fecha: req.body.fecha,
        tipo: req.body.tipo,
        finca:req.body.finca,
        estado: req.body.estado,
        imagen: req.body.imagen,
        comentarios: req.body.comentarios,
        id_usuario: req.body.id_usuario,
    };
    mysqlconexion.query(`UPDATE ganado SET nombre=?, numero=?, sexo=?, color=?, peso=?, 
    fecha=?, tipo=?, finca=?, estado=?, imagen=?, comentarios=?, id_usuario=? WHERE id=?`,
        [ganado.nombre, ganado.numero, ganado.sexo, ganado.color, ganado.peso, ganado.fecha,
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
    const ganado = {
        descripcion: "Nombre: "+req.body.nombre+" Numero: "+req.body.numero,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`DELETE FROM ganado WHERE id=?;`,
    [id], (error,rows,fields)=>{
        if(!error){
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) VALUES ('Eliminar ganado', ?, now(), ?);`,
            [ganado.descripcion, ganado.id_usuario], (error2,rows2,fields2)=>{
                if(error2){
                    console.log(error2);
                }
            })
            res.json(rows);
        }
        else{
            console.log(error);
        }
    })
});

module.exports = router;