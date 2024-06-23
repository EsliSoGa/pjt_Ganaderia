const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

// Resto del código (get, post, put, delete)
router.get('/', (req, res) => {
    mysqlconexion.query(`SELECT t.id, t.Finca_origen, t.Finca_destino, t.Fecha, t.Id_ganado, g.Numero, g.Nombre
    FROM traslado as t
    INNER JOIN ganado as g
    on t.Id_ganado = g.id
    ORDER BY t.id desc`,
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
    mysqlconexion.query(`SELECT t.id, t.Finca_origen, t.Finca_destino, t.Fecha, t.Id_ganado, g.Numero, g.Nombre
    FROM traslado as t
    INNER JOIN ganado as g
    on t.Id_ganado = g.id WHERE t.id=?`,
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
    const { Id_ganado, Finca_destino, Fecha, id_usuario } = req.body;
    mysqlconexion.query(`SELECT Finca FROM ganado WHERE id = ?`, [Id_ganado], (error, results) => {
        if (!error && results.length > 0) {
            const Finca_origen = results[0].Finca;
            const descripcion = `Nombre: ${req.body.Nombre}, Numero: ${req.body.Numero}, traslado de finca ${Finca_origen} a ${Finca_destino}`;

            mysqlconexion.query(`INSERT INTO traslado (Finca_origen, Finca_destino, Fecha, Id_ganado) VALUES (?, ?, ?, ?)`,
                [Finca_origen, Finca_destino, Fecha, Id_ganado], (error, rows, fields) => {
                    if (!error) {
                        mysqlconexion.query(`UPDATE ganado SET Finca = ? WHERE id = ?`,
                            [Finca_destino, Id_ganado], (updateError, updateRows, updateFields) => {
                                if (!updateError) {
                                    mysqlconexion.query(`INSERT INTO bitacora (Accion, Descripcion, Fecha, Id_usuario) VALUES ('Crear traslado', ?, now(), ?)`,
                                        [descripcion, id_usuario], (error2, rows2, fields2) => {
                                            if (error2) {
                                                console.log(error2);
                                            }
                                        })
                                    res.send({ code: 200, success: "Registrado correctamente" });
                                } else {
                                    console.log(updateError);
                                    res.send({ code: 400, failed: "Error occurred while updating finca", error: updateError });
                                }
                            });
                    } else {
                        console.log(error);
                        res.send({ code: 400, failed: "Error occurred", error: error });
                    }
                })
        } else {
            res.send({ code: 400, failed: "Error occurred", error: error });
        }
    });
});


// put
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { Finca_destino, Fecha, Id_ganado, Nombre, Numero, id_usuario } = req.body;
    mysqlconexion.query(`SELECT Finca FROM ganado WHERE id = ?`, [Id_ganado], (error, results) => {
        if (!error && results.length > 0) {
            const Finca_origen = results[0].Finca;
            const descripcion = `Nombre: ${Nombre}, Numero: ${Numero}, traslado de finca ${Finca_origen} a ${Finca_destino}`;

            mysqlconexion.query(`UPDATE traslado SET Finca_origen=?, Finca_destino=?, Fecha=?, Id_ganado=? WHERE id=?`,
                [Finca_origen, Finca_destino, Fecha, Id_ganado, id], (error, rows, fields) => {
                    if (!error) {
                        mysqlconexion.query(`UPDATE ganado SET Finca = ? WHERE id = ?`,
                            [Finca_destino, Id_ganado], (updateError, updateRows, updateFields) => {
                                if (!updateError) {
                                    mysqlconexion.query(`INSERT INTO bitacora (Accion, Descripcion, Fecha, Id_usuario) VALUES ('Actualización de traslado', ?, now(), ?)`,
                                        [descripcion, id_usuario], (error2, rows2, fields2) => {
                                            if (error2) {
                                                console.log(error2);
                                            }
                                        })
                                    res.send({ code: 200, success: "Actualizado correctamente" });
                                } else {
                                    console.log(updateError);
                                    res.send({ code: 400, failed: "Error occurred while updating finca", error: updateError });
                                }
                            });
                    } else {
                        console.log(error);
                        res.send({ code: 400, failed: "Error occurred", error: error });
                    }
                })
        } else {
            res.send({ code: 400, failed: "Error occurred", error: error });
        }
    });
});


// delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { Nombre, Numero, Finca_origen, Finca_destino, id_usuario } = req.body;
    const descripcion = `Nombre: ${Nombre}, Numero: ${Numero}, traslado de finca ${Finca_origen} a ${Finca_destino}`;

    mysqlconexion.query('DELETE FROM traslado WHERE id=?', [id], (error, rows, fields) => {
        if (!error) {
            mysqlconexion.query(`INSERT INTO bitacora (Accion, Descripcion, Fecha, Id_usuario) VALUES ('Eliminar traslado', ?, now(), ?)`,
                [descripcion, id_usuario], (error2, rows2, fields2) => {
                    if (error2) {
                        console.log(error2);
                    }
                })
            res.json(rows);
        } else {
            console.log(error);
            res.send({ code: 400, failed: "error occurred", error: error });
        }
    })
});

module.exports = router;
