const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

// Resto del código (get, post, put, delete)
router.get('/', (req, res) => {
    mysqlconexion.query(`SELECT l.id, l.Fecha, l.Produccion_diaria, l.Id_ganado, g.Numero, g.Nombre
    FROM leche as l
    INNER JOIN ganado as g
    on l.Id_ganado = g.id
    ORDER BY l.id desc`,
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
    mysqlconexion.query(`SELECT l.id, l.Fecha, l.Produccion_diaria, l.Id_ganado, g.Numero, g.Nombre
    FROM leche as l
    INNER JOIN ganado as g
    on l.Id_ganado = g.id WHERE l.id=?`,
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
    const leche = {
        Fecha: req.body.Fecha ? new Date(req.body.Fecha).toISOString().slice(0, 10) : null,
        Produccion_diaria: req.body.Produccion_diaria,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", producción diaria: " + req.body.Produccion_diaria,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`INSERT INTO leche (Fecha, Produccion_diaria, Id_ganado) 
    VALUES (?, ?, ?);`,
        [leche.Fecha, leche.Produccion_diaria, leche.Id_ganado],
        (error, rows, fields) => {
            if (!error) {
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Crear producción de leche', ?, now(), ?);`,
                    [leche.descripcion, leche.id_usuario], (error2, rows2, fields2) => {
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
    const leche = {
        Fecha: req.body.Fecha ? new Date(req.body.Fecha).toISOString().slice(0, 10) : null,
        Produccion_diaria: req.body.Produccion_diaria,
        Id_ganado: req.body.Id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", producción diaria: " + req.body.Produccion_diaria,
        id_usuario: req.body.id_usuario || 2 // Si no se pasa id_usuario, usar 2 por defecto
    };
    mysqlconexion.query(`UPDATE leche SET Fecha=?, Produccion_diaria=?, Id_ganado=?
    WHERE id=?`,
        [leche.Fecha, leche.Produccion_diaria, leche.Id_ganado, id],
        (error, rows, fields) => {
            if (!error) {
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Actualización de producción de leche', ?, now(), ?);`,
                    [leche.descripcion, leche.id_usuario], (error2, rows2, fields2) => {
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
    const leche = {
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", producción diaria: " + req.body.Produccion_diaria,
        id_usuario: req.body.id_usuario || 2 // Si no se pasa id_usuario, usar 2 por defecto
    };
    mysqlconexion.query('DELETE FROM leche WHERE id=?', [id], (error, rows, fields) => {
        if (!error) {
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
            VALUES ('Eliminación de producción de leche', ?, now(), ?);`,
                [leche.descripcion, leche.id_usuario], (error2, rows2, fields2) => {
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
