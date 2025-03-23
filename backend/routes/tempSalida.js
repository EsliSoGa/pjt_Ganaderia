const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');
const multer = require('multer');
const path = require('path');

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

//get
router.get('/', (req, res) => {
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero
    FROM salidas_temporal as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id`,
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            }
            else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        })
});

//get con ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query(`SELECT s.id, s.Fecha, Motivo, s.Imagen, s.Comentarios, Id_ganado, g.Numero
    FROM salidas_temporal as s
    INNER JOIN ganado as g
    on s.Id_ganado = g.id WHERE s.id=?`,
        [id], (error, rows, fields) => {
            if (!error) {
                res.json(rows[0]);
            }
            else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        });
});

//post
router.post('/', (req, res) => {
    const salida = {
        Fecha: req.body.Fecha ? new Date(req.body.Fecha).toISOString().slice(0, 10) : null,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO salidas_temporal (Fecha, Motivo, Imagen, Comentarios, Id_ganado)
    VALUES (?, ?, ?, ?, ?);`,
        [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios, salida.Id_ganado],
        (error, rows, fields) => {
            if (!error) {
                console.log('Enviado');
                res.send({
                    code: 200,
                    success: "Registrado correctamente",
                });
            }
            else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        })
});

//put
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const salida = {
        Fecha: req.body.Fecha ? new Date(req.body.Fecha).toISOString().slice(0, 10) : null,
        Motivo: req.body.Motivo,
        Imagen: req.body.Imagen,
        Comentarios: req.body.Comentarios,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE salidas_temporal SET Fecha=?, Motivo=?, Imagen=?, Comentarios=?, Id_ganado=?
    WHERE id=?`,
        [salida.Fecha, salida.Motivo, salida.Imagen, salida.Comentarios, salida.Id_ganado, id],
        (error, rows, fields) => {
            if (!error) {
                res.send({
                    code: 200,
                    success: "Actualizado correctamente",
                });
            }
            else {
                console.log(error);
                res.send({
                    code: 400,
                    failed: "error occurred",
                    error: error
                });
            }
        })
});

//delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query('DELETE FROM salidas_temporal WHERE id=?', [id], (error, rows, fields) => {
        if (!error) {
            res.send({
                code: 200,
                success: "Eliminado correctamente",
            });
        }
        else {
            console.log(error);
            res.send({
                code: 400,
                failed: "error occurred",
                error: error
            });
        }
    })
});

//Aprobación de salida
router.post('/aprobar', (req, res) => {
    const { id, id_usuario, Id_ganado } = req.body;

    console.log('Iniciando aprobación de salida:', { id, id_usuario, Id_ganado });

    if (!Id_ganado) {
        return res.status(400).json({ error: 'Id_ganado es requerido.' });
    }

    mysqlconexion.query(`UPDATE ganado SET estado = 0 WHERE id = ?`, [Id_ganado],
        (error, result) => {
            if (!error) {
                console.log('Estado del ganado actualizado a inactivo:', result);

                mysqlconexion.query(`INSERT INTO salidas (Fecha, Motivo, Imagen, Comentarios, Id_ganado) SELECT Fecha, Motivo, Imagen, Comentarios, Id_ganado FROM salidas_temporal WHERE id = ?`, [id],
                    (error2, result2) => {
                        if (!error2) {
                            console.log('Salida movida a tabla principal:', result2);

                            mysqlconexion.query(`DELETE FROM salidas_temporal WHERE id = ?`, [id],
                                (error3, result3) => {
                                    if (!error3) {
                                        console.log('Salida temporal eliminada:', result3);
                                        res.json({ success: true, message: "Salida aprobada y ganado actualizado a inactivo" });
                                    } else {
                                        console.log('Error al eliminar la salida temporal:', error3);
                                        res.status(400).send({
                                            failed: "error occurred",
                                            error: error3
                                        });
                                    }
                                });
                        } else {
                            console.log('Error al mover la salida a la tabla principal:', error2);
                            res.status(400).send({
                                failed: "error occurred",
                                error: error2
                            });
                        }
                    });
            } else {
                console.log('Error al actualizar el estado del ganado:', error);
                res.status(400).send({
                    failed: "error occurred",
                    error: error
                });
            }
        });
});

module.exports = router;
