const express = require('express');
const router = express.Router();
const pool = require('../db_promise');

router.use(express.json());
// Reporte 1: Obtener tipos de animales por finca
router.get('/reporte1', async (req, res) => {
    const { finca } = req.query;
    if (!finca) {
        return res.status(400).json({ message: 'El parámetro finca es requerido' });
    }

    try {
        const query = `
            SELECT Tipo, COUNT(*) as cantidad 
            FROM ganado 
            WHERE Finca = ?
            GROUP BY Tipo
        `;
        const [rows] = await pool.query(query, [finca]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching animal types:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Reporte 2: Estimación de partos por finca
router.get('/reporte2', async (req, res) => {
    const { finca } = req.query;
    if (!finca) {
        return res.status(400).json({ message: 'El parámetro finca es requerido' });
    }

    try {
        const query = `
            SELECT 
                g.Finca,
                COUNT(*) AS PartosEstimados,
                DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH) AS FechaEstimadaParto
            FROM 
                servicios s
            INNER JOIN 
                ganado g ON s.Id_ganado = g.id
            WHERE 
                g.Finca = ? 
                AND DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 5 MONTH)
            GROUP BY 
                FechaEstimadaParto
            ORDER BY 
                FechaEstimadaParto ASC;
        `;
        const [rows] = await pool.query(query, [finca]);

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.json({ message: 'No se encontraron partos estimados para los próximos 5 meses' });
        }
    } catch (error) {
        console.error("Error fetching estimated births:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Reporte3 toros de 8.5 a 9 meses
router.get('/reporte3', async (req, res) => {
    const { finca } = req.query;
    if (!finca) {
        return res.status(400).json({ message: 'El parámetro finca es requerido' });
    }

    try {
        const query = `
            SELECT g.Finca, COUNT(*) AS CantidadAnimales
            FROM ganado AS g
            WHERE g.Sexo = 'Masculino'
            AND TIMESTAMPDIFF(MONTH, g.Fecha, CURDATE()) = 38
            AND DATEDIFF(CURDATE(), g.Fecha) >= (38 * 30 + 15)
            AND g.Finca = ?
            GROUP BY g.Finca;
        `;
        const [rows] = await pool.query(query, [finca]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching ganado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Reporte4 Novillas de 2.5 años

router.get('/reporte4', async (req, res) => {
    const { finca } = req.query;
    if (!finca) {
        return res.status(400).json({ message: 'El parámetro finca es requerido' });
    }

    try {
        const query = `
            SELECT g.Finca, COUNT(*) AS CantidadAnimales
            FROM ganado AS g
            WHERE g.Sexo = 'Femenino'
            AND TIMESTAMPDIFF(MONTH, g.Fecha, CURDATE()) = 60
            AND g.Finca = ?
            GROUP BY g.Finca;
        `;
        const [rows] = await pool.query(query, [finca]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching ganado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Reporte 5 - Placeholder para reportes futuros
router.get('/reporte5', (req, res) => {
    res.json({ message: 'Reporte 5 en desarrollo' });
});


module.exports = router;
