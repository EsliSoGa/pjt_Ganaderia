const express = require('express');
const router = express.Router();
const pool = require('../db_promise');

// Obtener reporte de ganado
router.get('/ganado', async (req, res) => {
    const { finca } = req.query;
    try {
        let query = `SELECT Tipo, Finca, COUNT(*) as cantidad FROM ganado`;
        if (finca) {
            query += ` WHERE Finca = ${pool.escape(finca)}`;
        }
        query += ` GROUP BY Tipo, Finca`;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching ganado report:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Obtener lista de ganados
router.get('/ganado/list', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT id, Numero, Finca FROM ganado`);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching ganado list:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Obtener reporte de leche individual
router.get('/leche/individual/:id', async (req, res) => {
    const { id } = req.params;
    const { finca } = req.query;
    try {
        let query = `
            SELECT l.Fecha, l.Produccion_diaria 
            FROM leche l
            JOIN ganado g ON l.Id_ganado = g.id
            WHERE l.Id_ganado = ?
        `;
        const params = [id];
        if (finca) {
            query += ` AND g.Finca = ?`;
            params.push(finca);
        }
        query += ` ORDER BY l.Fecha`;
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching leche individual report:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener reporte de leche General
router.get('/leche/general', async (req, res) => {
    const { finca } = req.query;
    try {
        let query = `
            SELECT DATE_FORMAT(l.Fecha, '%Y-%m-%d') as Fecha, AVG(CAST(l.Produccion_diaria AS UNSIGNED)) as promedio_produccion 
            FROM leche l
            JOIN ganado g ON l.Id_ganado = g.id
        `;
        const params = [];
        if (finca) {
            query += ` WHERE g.Finca = ?`;
            params.push(finca);
        }
        query += ` GROUP BY l.Fecha ORDER BY l.Fecha`;
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching leche general report:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener nacimientos generales
router.get('/nacimientos/general', async (req, res) => {
    const { finca } = req.query;
    try {
        let query = `
            SELECT 
                ganado.Nombre as NombreGanado, 
                servicios.Fecha, 
                servicios.Edad,
                DATE_ADD(servicios.Fecha, INTERVAL (9 - servicios.Edad) MONTH) as FechaProbableParto
            FROM 
                servicios 
            INNER JOIN 
                ganado 
            ON 
                servicios.Id_ganado = ganado.id
        `;
        if (finca) {
            query += ` WHERE ganado.Finca = ${pool.escape(finca)}`;
        }
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching nacimientos generales:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener reporte detallado
router.get('/detallado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [general] = await pool.query(`
            SELECT Nombre, Numero, Sexo, Color, Peso, Fecha as FechaNacimiento, Tipo, Finca, Estado, Imagen, Comentarios, estado_secundario 
            FROM ganado 
            WHERE id = ?
        `, [id]);

        const [traslados] = await pool.query(`
            SELECT Fecha, Finca_origen, Finca_destino 
            FROM traslado 
            WHERE Id_ganado = ?
        `, [id]);

        const [ventas] = await pool.query(`
            SELECT Fecha, Comprador, Precio, Peso, Total 
            FROM venta 
            WHERE Id_ganado = ?
        `, [id]);

        const [servicios] = await pool.query(`
            SELECT Fecha, Condicion, Edad, Comentario 
            FROM servicios 
            WHERE Id_ganado = ?
        `, [id]);

        const [salidas] = await pool.query(`
            SELECT Fecha, Motivo, Imagen, Comentarios 
            FROM salidas 
            WHERE Id_ganado = ?
        `, [id]);

        const [vacunas] = await pool.query(`
            SELECT Fecha_aplicacion, Tipo_vacuna, Dosis, Proxima_aplicacion, Responsable, Observaciones 
            FROM aplicacionvacunas 
            WHERE id_ganado = ?
        `, [id]);

        const [fechaTentativaNacimiento] = await pool.query(`
            SELECT Fecha, 
                DATE_ADD(Fecha, INTERVAL (9 - Edad) MONTH) as FechaTentativa
            FROM servicios
            WHERE Id_ganado = ? AND Condicion = 'Deteccion de Feto'
        `, [id]);

        const [padres] = await pool.query(`
            SELECT 
                (SELECT Nombre FROM ganado WHERE id = Id_ganado_padre) as Padre, 
                (SELECT Nombre FROM ganado WHERE id = Id_ganado_madre) as Madre, 
                Tipo_nacimiento as TipoNacimiento 
            FROM relacion_padres 
            WHERE Id_ganado_hijo = ?
        `, [id]);

        const result = {
            ...general[0],
            Traslados: traslados,
            Ventas: ventas,
            Servicios: servicios,
            Salidas: salidas,
            Vacunas: vacunas,
            FechaTentativaNacimiento: fechaTentativaNacimiento,
            Padres: padres[0]
        };

        res.json(result);
    } catch (error) {
        console.error("Error fetching detallado report:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
