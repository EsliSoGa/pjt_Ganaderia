const express = require('express');
const router = express.Router();
const pool = require('../db_promise');

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

// Reporte 2, 3, 4, 5 - Placeholder para reportes futuros
router.get('/reporte2', (req, res) => {
    res.json({ message: 'Reporte 2 en desarrollo' });
});

router.get('/reporte3', (req, res) => {
    res.json({ message: 'Reporte 3 en desarrollo' });
});

router.get('/reporte4', (req, res) => {
    res.json({ message: 'Reporte 4 en desarrollo' });
});

router.get('/reporte5', (req, res) => {
    res.json({ message: 'Reporte 5 en desarrollo' });
});

module.exports = router;
