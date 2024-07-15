const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');

// Resto del código (get, post, put, delete)
router.get('/', (req, res) => {
    mysqlconexion.query(`SELECT v.id, v.fecha_aplicacion, v.tipo_vacuna, v.dosis, v.proxima_aplicacion, v.responsable, v.observaciones, v.id_ganado, g.Numero, g.Nombre
    FROM AplicacionVacunas as v
    INNER JOIN ganado as g
    on v.id_ganado = g.id
    ORDER BY v.id desc`,
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
    mysqlconexion.query(`SELECT v.id, v.fecha_aplicacion, v.tipo_vacuna, v.dosis, v.proxima_aplicacion, v.responsable, v.observaciones, v.id_ganado, g.Numero, g.Nombre
    FROM AplicacionVacunas as v
    INNER JOIN ganado as g
    on v.id_ganado = g.id WHERE v.id=?`,
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
    const vacuna = {
        fecha_aplicacion: req.body.fecha_aplicacion ? new Date(req.body.fecha_aplicacion).toISOString().slice(0, 10) : null,
        tipo_vacuna: req.body.tipo_vacuna,
        dosis: req.body.dosis,
        proxima_aplicacion: req.body.proxima_aplicacion ? new Date(req.body.proxima_aplicacion).toISOString().slice(0, 10) : null,
        responsable: req.body.responsable,
        observaciones: req.body.observaciones,
        id_ganado: req.body.id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", vacuna: " + req.body.tipo_vacuna,
        id_usuario: req.body.id_usuario
    };
    mysqlconexion.query(`INSERT INTO AplicacionVacunas (fecha_aplicacion, tipo_vacuna, dosis, proxima_aplicacion, responsable, observaciones, id_ganado) 
    VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [vacuna.fecha_aplicacion, vacuna.tipo_vacuna, vacuna.dosis, vacuna.proxima_aplicacion, vacuna.responsable, vacuna.observaciones, vacuna.id_ganado],
        (error, rows, fields) => {
            if (!error) {
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Aplicación de vacuna', ?, now(), ?);`,
                    [vacuna.descripcion, vacuna.id_usuario], (error2, rows2, fields2) => {
                        if (error2) {
                            console.log(error2);
                        }
                    })
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
    const vacuna = {
        fecha_aplicacion: req.body.fecha_aplicacion ? new Date(req.body.fecha_aplicacion).toISOString().slice(0, 10) : null,
        tipo_vacuna: req.body.tipo_vacuna,
        dosis: req.body.dosis,
        proxima_aplicacion: req.body.proxima_aplicacion ? new Date(req.body.proxima_aplicacion).toISOString().slice(0, 10) : null,
        responsable: req.body.responsable,
        observaciones: req.body.observaciones,
        id_ganado: req.body.id_ganado,
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", vacuna: " + req.body.tipo_vacuna,
        id_usuario: req.body.id_usuario || 2
    };
    mysqlconexion.query(`UPDATE AplicacionVacunas SET fecha_aplicacion=?, tipo_vacuna=?, dosis=?, proxima_aplicacion=?, responsable=?, observaciones=?, id_ganado=?
    WHERE id=?`,
        [vacuna.fecha_aplicacion, vacuna.tipo_vacuna, vacuna.dosis, vacuna.proxima_aplicacion, vacuna.responsable, vacuna.observaciones, vacuna.id_ganado, id],
        (error, rows, fields) => {
            if (!error) {
                mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
                VALUES ('Actualización de aplicación de vacuna', ?, now(), ?);`,
                    [vacuna.descripcion, vacuna.id_usuario], (error2, rows2, fields2) => {
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
    const vacuna = {
        descripcion: "Nombre: " + req.body.Nombre + ", Numero: " + req.body.Numero + ", vacuna: " + req.body.tipo_vacuna,
        id_usuario: req.body.id_usuario || 2
    };
    mysqlconexion.query('DELETE FROM AplicacionVacunas WHERE id=?', [id], (error, rows, fields) => {
        if (!error) {
            mysqlconexion.query(`INSERT bitacora(Accion, Descripcion, Fecha, Id_usuario) 
            VALUES ('Eliminación de aplicación de vacuna', ?, now(), ?);`,
                [vacuna.descripcion, vacuna.id_usuario], (error2, rows2, fields2) => {
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
