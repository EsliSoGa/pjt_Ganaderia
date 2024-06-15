const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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
        fecha: req.body.fecha ? new Date(req.body.fecha).toISOString().slice(0, 10) : null,
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
        fecha: req.body.fecha ? new Date(req.body.fecha).toISOString().slice(0, 10) : null,
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

// Configuración de multer para guardar las imágenes en la carpeta 'images'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }
    res.json({ filePath: `images/${req.file.filename}` });
});

module.exports = router;
