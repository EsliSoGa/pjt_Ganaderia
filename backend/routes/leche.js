const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

// Obtener todas las producciones de leche
router.get('/', (req, res) => {
    mysqlconexion.query(`SELECT l.id, l.Fecha, l.Produccion_diaria, l.Id_ganado, g.Nombre as NombreGanado
                         FROM leche l
                         INNER JOIN ganado g ON l.Id_ganado = g.id`,
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
    });
});

// Obtener una producción de leche por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query(`SELECT l.id, l.Fecha, l.Produccion_diaria, l.Id_ganado, g.Nombre as NombreGanado
                         FROM leche l
                         INNER JOIN ganado g ON l.Id_ganado = g.id
                         WHERE l.id = ?`, [id],
    (error, rows, fields) => {
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

// Crear una nueva producción de leche
router.post('/', (req, res) => {
    const leche = {
        Fecha: req.body.Fecha,
        Produccion_diaria: req.body.Produccion_diaria,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`INSERT INTO leche (Fecha, Produccion_diaria, Id_ganado)
                         VALUES (?, ?, ?);`,
        [leche.Fecha, leche.Produccion_diaria, leche.Id_ganado],
        (error, rows, fields) => {
            if (!error) {
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
    });
});

// Actualizar una producción de leche
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const leche = {
        Fecha: req.body.Fecha,
        Produccion_diaria: req.body.Produccion_diaria,
        Id_ganado: req.body.Id_ganado
    };
    mysqlconexion.query(`UPDATE leche SET Fecha = ?, Produccion_diaria = ?, Id_ganado = ?
                         WHERE id = ?`,
        [leche.Fecha, leche.Produccion_diaria, leche.Id_ganado, id],
        (error, rows, fields) => {
            if (!error) {
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
    });
});

// Eliminar una producción de leche
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query('DELETE FROM leche WHERE id = ?', [id], (error, rows, fields) => {
        if (!error) {
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
    });
});

module.exports = router;
