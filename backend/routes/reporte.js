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

module.exports = router;
