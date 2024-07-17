const express = require('express');
const router = express.Router();
const mysqlconexion = require('../db');
const cron = require('node-cron');

// Obtener reporte de ganado
router.get('/ganado', (req, res) => {
    mysqlconexion.query(
        SELECT tipo, COUNT(*) as cantidad 
         FROM ganado 
         WHERE tipo IN ('Torete', 'Novilla', 'Toro', 'Vaca', 'Ternero') 
         GROUP BY tipo,
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
        SELECT WEEK(Fecha) as semana, SUM(Produccion_diaria) as total_produccion
         FROM leche
         GROUP BY WEEK(Fecha)
         ORDER BY semana,
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
        SELECT Fecha, Produccion_diaria as total_produccion
         FROM leche
         WHERE Id_ganado = ?
         ORDER BY Fecha,
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
        SELECT COUNT(*) as total_vacas FROM ganado WHERE tipo = 'Vaca',
        (error, results) => {
            if (!error && results.length > 0) {
                const total_vacas = results[0].total_vacas;
                mysqlconexion.query(
                    INSERT INTO reporte_diario_ganado (tipo, cantidad, fecha, total_vacas)
                     SELECT tipo, COUNT(*) as cantidad, CURDATE(), ${total_vacas}
                     FROM ganado
                     WHERE tipo IN ('Torete', 'Novilla', 'Toro', 'Vaca', 'Ternero') 
                     GROUP BY tipo,
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
        SELECT 
            g.Nombre as NombreGanado,
            s.Edad as Meses,
            DATE_FORMAT(s.Fecha, '%Y-%m-%d') as Fecha,
            DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d') as FechaNacimiento
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_ganado = ?
         AND s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         ),
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
        SELECT 
            g.Nombre as NombreGanado,
            s.Edad as Meses,
            DATE_FORMAT(s.Fecha, '%Y-%m-%d') as Fecha,
            DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d') as FechaNacimiento
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         ),
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
        SELECT 
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
         GROUP BY g.Nombre, g.Color, s.Fecha, s.Edad, l.Produccion_diaria,
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

// Almacenar los reportes de nacimientos diariamente a las 8:00 PM
cron.schedule('0 20 * * *', () => {
    mysqlconexion.query(
        INSERT INTO reporte_nacimientos_individual (NombreGanado, Meses, Fecha, FechaNacimiento)
         SELECT g.Nombre, s.Edad, DATE_FORMAT(s.Fecha, '%Y-%m-%d'), DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d')
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         ),
        (error, results) => {
            if (error) {
                console.log('Error al almacenar el informe individual de nacimientos:', error);
            } else {
                console.log('Informe individual de nacimientos almacenado exitosamente');
            }
        }
    );

    mysqlconexion.query(
        INSERT INTO reporte_nacimientos_general (NombreGanado, Meses, Fecha, FechaNacimiento)
         SELECT g.Nombre, s.Edad, DATE_FORMAT(s.Fecha, '%Y-%m-%d'), DATE_FORMAT(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH), '%Y-%m-%d')
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         ),
        (error, results) => {
            if (error) {
                console.log('Error al almacenar el informe general de nacimientos:', error);
            } else {
                console.log('Informe general de nacimientos almacenado exitosamente');
            }
        }
    );

    mysqlconexion.query(
        INSERT INTO reporte_nacimientos_conteo (Anio, Mes, Total, TotalAnimales, FechaEspecifica)
         SELECT 
            YEAR(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH)) as Anio,
            MONTH(DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH)) as Mes,
            COUNT(*) as Total,
            COUNT(*) as TotalAnimales,
            CURDATE() as FechaEspecifica
         FROM servicios s
         INNER JOIN ganado g ON s.Id_ganado = g.id
         WHERE s.Id_tipo_servicio IN (
             SELECT ts.id FROM tipo_servicio ts WHERE ts.Nombre_tipo IN ('Palpación', 'Visual')
         )
         AND g.Sexo = 'Femenino'
         AND g.Estado = 1
         GROUP BY Anio, Mes,
        (error, results) => {
            if (error) {
                console.log('Error al almacenar el conteo de nacimientos:', error);
            } else {
                console.log('Conteo de nacimientos almacenado exitosamente');
            }
        }
    );
});


module.exports = router;