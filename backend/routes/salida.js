const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysqlconexion = require('../db');

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

// Resto del código (get, post, put, delete)
router.get('/', (req, res) => {
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero, g.Nombre
    FROM salidas as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id
    ORDER BY s.id desc`,
    (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.send({
                code: 400,
                failed: "error occurred",
                error: error
            });
        }
    })
});

// get con ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero, g.Nombre
    FROM salidas as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id WHERE s.id=?`,
        [id], (error, rows, fields) => {
            if (!error) {
                res.json(rows[0]);
            } else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        });
});

// post
router.post('/', (req, res) => {
    const salida = {
        Fecha: req.body.Fecha ? new Date(req.body.Fecha).toISOString().slice(0, 10) : null,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", por: " + req.body.Motivo + ". Comentarios: " + req.body.Comentarios,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`INSERT INTO salidas (Fecha, Motivo, Imagen, Comentarios, Id_ganado) 
    VALUES (?, ?, ?, ?, ?);`,
        [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios, salida.Id_ganado],
        (error, rows, fields) => {
            if (!error) {
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Crear salida', ?, now(), ?);`,
                    [salida.descripcion, salida.id_usuario], (error2, rows2, fields2) => {
                        if (error2) {
                            console.log(error2);
                        }
                    })
                console.log('Enviado');
                res.send({
                    code: 200,
                    success: "Registrado correctamente",
                });
            } else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        })
});

// put
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const salida = {
        Fecha: req.body.Fecha ? new Date(req.body.Fecha).toISOString().slice(0, 10) : null,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", por: " + req.body.Motivo + ". Comentarios: " + req.body.Comentarios,
        id_usuario: req.body.id_usuario || 2 // Si no se pasa id_usuario, usar 2 por defecto
    };
    mysqlconexion.query(`UPDATE salidas SET Fecha=?, Motivo=?, Imagen=?, Comentarios=?, Id_ganado=?
    WHERE id=?`,
        [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios, salida.Id_ganado, id],
        (error, rows, fields) => {
            if (!error) {
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Actualización de salida', ?, now(), ?);`,
                    [salida.descripcion, salida.id_usuario], (error2, rows2, fields2) => {
                        if (error2) {
                            console.log(error2);
                        }
                    })
                res.send({
                    code: 200,
                    success: "Actualizado correctamente",
                });
            } else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        })
});

// delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const salida = {
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", por: " + req.body.Motivo + ". Comentarios: " + req.body.Comentarios,
        id_usuario: req.body.id_usuario || 2 // Si no se pasa id_usuario, usar 2 por defecto
    };
    mysqlconexion.query('DELETE FROM salidas WHERE id=?', [id], (error, rows, fields) => {
        if (!error) {
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
            VALUES ('Eliminación de salida', ?, now(), ?);`,
                [salida.descripcion, salida.id_usuario], (error2, rows2, fields2) => {
                    if (error2) {
                        console.log(error2);
                    }
                })
            res.send({
                code: 200,
                success: "Eliminado correctamente",
            });
        } else {
            console.log(error);
            res.send({
                code: 400,
                failed: "error occurred",
                error: error
            });
        }
    })
});

module.exports = router;
