const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

// Obtener todas las actividades
router.get('/', (req, res) => {
    mysqlconexion.query('SELECT * FROM actividades', (error, rows) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
        }
    });
});

// Crear una nueva actividad
router.post('/', (req, res) => {
    const actividad = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha,
        comentarios: req.body.comentarios
    };
    mysqlconexion.query('INSERT INTO actividades SET ?', actividad, (error, results) => {
        if (!error) {
            res.status(200).json({ id: results.insertId, ...actividad });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Error al crear la actividad' });
        }
    });
});

// Actualizar una actividad
// post
router.post('/', (req, res) => {
    const actividad = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha ? new Date(req.body.fecha).toISOString().slice(0, 10) : null,
        comentarios: req.body.comentarios,
        estado: req.body.estado || 'Nueva'
    };
    mysqlconexion.query(`INSERT INTO actividades (nombre, descripcion, fecha, comentarios, estado) VALUES (?, ?, ?, ?, ?)`,
        [actividad.nombre, actividad.descripcion, actividad.fecha, actividad.comentarios, actividad.estado],
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
                console.log('Actividad creada');
            } else {
                console.log(error);
            }
        });
});

// put
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const actividad = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha ? new Date(req.body.fecha).toISOString().slice(0, 10) : null,
        comentarios: req.body.comentarios,
        estado: req.body.estado
    };
    mysqlconexion.query(`UPDATE actividades SET nombre=?, descripcion=?, fecha=?, comentarios=?, estado=? WHERE id=?`,
        [actividad.nombre, actividad.descripcion, actividad.fecha, actividad.comentarios, actividad.estado, id],
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
            }
        });
});


module.exports = router;
