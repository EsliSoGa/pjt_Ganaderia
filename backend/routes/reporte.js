const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');
const cron = require('node-cron');

// Obtener reporte de ganado
router.get('/ganado', (req, res) => {
    mysqlconexion.query(
        `SELECT tipo, COUNT(*) as cantidad 
         FROM ganado 
         WHERE tipo IN ('Torete', 'Novilla', 'Toro', 'Vaca', 'Ternero') 
         GROUP BY tipo`,
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener el reporte de ganado' });
            }
        }
    );
});

// Obtener reporte general de leche
router.get('/leche/general', (req, res) => {
    mysqlconexion.query(
        `SELECT WEEK(Fecha) as semana, SUM(Produccion_diaria) as total_produccion
         FROM leche
         GROUP BY WEEK(Fecha)
         ORDER BY semana`,
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener el reporte de leche' });
            }
        }
    );
});

// Obtener reporte específico de leche por id de ganado
router.get('/leche/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query(
        `SELECT Fecha, Produccion_diaria as total_produccion
         FROM leche
         WHERE Id_ganado = ?
         ORDER BY Fecha`,
        [id],
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener el reporte de leche' });
            }
        }
    );
});

// Almacenar el reporte diariamente a las 8:03 PM
cron.schedule('3 20 * * *', () => {
    mysqlconexion.query(
        `SELECT COUNT(*) as total_vacas FROM ganado WHERE tipo = 'Vaca'`,
        (error, results) => {
            if (!error && results.length > 0) {
                const total_vacas = results[0].total_vacas;
                mysqlconexion.query(
                    `INSERT INTO reporte_diario_ganado (tipo, cantidad, fecha, total_vacas)
                     SELECT tipo, COUNT(*) as cantidad, CURDATE(), ${total_vacas}
                     FROM ganado
                     WHERE tipo IN ('Torete', 'Novilla', 'Toro', 'Vaca', 'Ternero') 
                     GROUP BY tipo`,
                    (error, rows, fields) => {
                        if (!error) {
                            console.log('Reporte diario almacenado exitosamente');
                        } else {
                            console.log('Error al almacenar el reporte diario:', error);
                        }
                    }
                );
            } else {
                console.log('Error al obtener el total de vacas:', error);
            }
        }
    );
});

// Obtener informe individual de nacimientos
router.get('/servicio/nacimientos/individual/:id_ganado', (req, res) => {
    const { id_ganado } = req.params;
    mysqlconexion.query(
        `SELECT 
            g.Nombre as NombreGanado,
            s.Edad as Meses,
            DATE_FORMAT(s.Fecha, '%Y-%m-%d') as Fecha,
            DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d') as FechaNacimiento
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_ganado = ?
         AND s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         )`,
        [id_ganado],
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener el informe individual de nacimientos' });
            }
        }
    );
});

// Obtener informe general de nacimientos
router.get('/servicio/nacimientos/general', (req, res) => {
    mysqlconexion.query(
        `SELECT 
            g.Nombre as NombreGanado,
            s.Edad as Meses,
            DATE_FORMAT(s.Fecha, '%Y-%m-%d') as Fecha,
            DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d') as FechaNacimiento
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         )`,
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener el informe general de nacimientos' });
            }
        }
    );
});

// Obtener conteo total de posibles nacimientos
router.get('/servicio/nacimientos/conteo', (req, res) => {
    mysqlconexion.query(
        `SELECT 
            g.Nombre as NombreGanado,
            g.Color,
            DATE_FORMAT(s.Fecha, '%Y-%m-%d') as Fecha,
            DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d') as FechaNacimiento,
            l.Produccion_diaria,
            COUNT(*) as Total
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         LEFT JOIN leche l ON g.id = l.Id_ganado
         WHERE s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         )
         AND g.Sexo = 'Femenino'
         AND g.Estado = 1
         GROUP BY g.Nombre, g.Color, s.Fecha, s.Edad, l.Produccion_diaria`,
        (error, rows, fields) => {
            if (!error) {
                res.json(rows);
            } else {
                console.log(error);
                res.status(500).json({ error: 'Error al obtener el conteo total de nacimientos' });
            }
        }
    );
});

// routes/reporte.js
router.get('/detallado/:id', (req, res) => {
    const { id } = req.params;
    mysqlconexion.query(
        `SELECT 
            g.Nombre,
            g.Numero,
            g.Sexo,
            g.Color,
            g.Peso,
            g.Fecha as FechaNacimiento,
            g.Tipo,
            g.Finca,
            g.Estado,
            g.Imagen,
            g.Comentarios,
            g.estado_secundario,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', t.Fecha, 'Finca_origen', t.Finca_origen, 'Finca_destino', t.Finca_destino)) FROM traslado t WHERE t.Id_ganado = g.id) as Traslados,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', v.Fecha, 'Comprador', v.Comprador, 'Precio', v.Precio, 'Peso', v.Peso, 'Total', v.Total)) FROM venta v WHERE v.Id_ganado = g.id) as Ventas,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', s.Fecha, 'Condicion', s.Condicion, 'Edad', s.Edad, 'Comentario', s.Comentario)) FROM servicios s WHERE s.Id_ganado = g.id) as Servicios,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', sa.Fecha, 'Motivo', sa.Motivo, 'Imagen', sa.Imagen, 'Comentarios', sa.Comentarios)) FROM salidas sa WHERE sa.Id_ganado = g.id) as Salidas,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha_aplicacion', av.Fecha_aplicacion, 'Tipo_vacuna', av.Tipo_vacuna, 'Dosis', av.Dosis, 'Proxima_aplicacion', av.Proxima_aplicacion, 'Responsable', av.Responsable, 'Observaciones', av.Observaciones)) FROM aplicacionvacunas av WHERE av.Id_ganado = g.id) as Vacunas,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', l.Fecha, 'Produccion_diaria', l.Produccion_diaria)) FROM leche l WHERE l.Id_ganado = g.id) as ProduccionLeche,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d'))) FROM servicios s WHERE s.Id_ganado = g.id AND s.Id_tipo_servicio IN (SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual'))) as FechaTentativaNacimiento,
            (SELECT JSON_OBJECT('Padre', (SELECT Nombre FROM ganado WHERE id = rp.Id_ganado_padre), 'Madre', (SELECT Nombre FROM ganado WHERE id = rp.Id_ganado_madre), 'TipoNacimiento', rp.Tipo_nacimiento) FROM relacion_padres rp WHERE rp.Id_ganado_hijo = g.id) as Padres
        FROM ganado g
        WHERE g.id = ?`,
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al obtener el informe detallado del ganado' });
            } else {
                res.json(results[0]);
            }
        }
    );
});

// Obtener reporte general de ganado
router.get('/general', (req, res) => {
    mysqlconexion.query(
        `SELECT 
            g.*, 
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', t.Fecha, 'Finca_origen', t.Finca_origen, 'Finca_destino', t.Finca_destino)) FROM traslado t WHERE t.Id_ganado = g.id) as Traslados,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', v.Fecha, 'Comprador', v.Comprador, 'Precio', v.Precio, 'Peso', v.Peso, 'Total', v.Total)) FROM venta v WHERE v.Id_ganado = g.id) as Ventas,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', s.Fecha, 'Condicion', s.Condicion, 'Edad', s.Edad, 'Comentario', s.Comentario)) FROM servicios s WHERE s.Id_ganado = g.id) as Servicios,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', sa.Fecha, 'Motivo', sa.Motivo, 'Imagen', sa.Imagen, 'Comentarios', sa.Comentarios)) FROM salidas sa WHERE sa.Id_ganado = g.id) as Salidas,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha_aplicacion', av.Fecha_aplicacion, 'Tipo_vacuna', av.Tipo_vacuna, 'Dosis', av.Dosis, 'Proxima_aplicacion', av.Proxima_aplicacion, 'Responsable', av.Responsable, 'Observaciones', av.Observaciones)) FROM aplicacionvacunas av WHERE av.Id_ganado = g.id) as Vacunas,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('Fecha', DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d'))) FROM servicios s WHERE s.Id_ganado = g.id AND s.Id_tipo_servicio IN (SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual'))) as FechaTentativaNacimiento,
            (SELECT JSON_OBJECT('Padre', (SELECT Nombre FROM ganado WHERE id = rp.Id_ganado_padre), 'Madre', (SELECT Nombre FROM ganado WHERE id = rp.Id_ganado_madre), 'TipoNacimiento', rp.Tipo_nacimiento) FROM relacion_padres rp WHERE rp.Id_ganado_hijo = g.id) as Padres
        FROM ganado g`,
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al obtener el informe general del ganado' });
            } else {
                res.json(results);
            }
        }
    );
});


module.exports = router;
