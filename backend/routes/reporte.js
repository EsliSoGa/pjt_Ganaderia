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
        // Consulta SQL para obtener los partos estimados con la información del animal, finca y padres
        const query = `
            SELECT 
                g.Finca,
                g.Nombre AS NombreAnimal,
                g.Numero AS NumeroAnimal,
                DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH) AS FechaEstimadaParto,
                COUNT(*) AS PartosEstimados,
                p.Nombre AS NombrePadre,
                m.Nombre AS NombreMadre
            FROM 
                servicios s
            INNER JOIN 
                ganado g ON s.Id_ganado = g.id
            LEFT JOIN 
                relacion_padres rp ON rp.Id_ganado_hijo = g.id
            LEFT JOIN 
                ganado p ON rp.Id_ganado_padre = p.id
            LEFT JOIN 
                ganado m ON rp.Id_ganado_madre = m.id
            WHERE 
                g.Finca = ? 
                AND DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 5 MONTH)
            GROUP BY 
                FechaEstimadaParto, g.Nombre, g.Numero, g.Finca, p.Nombre, m.Nombre
            ORDER BY 
                FechaEstimadaParto ASC;
        `;

        // Ejecutar la consulta con el parámetro de finca
        const [rows] = await pool.query(query, [finca]);

        if (rows.length > 0) {
            res.json(rows); // Enviar los datos obtenidos como respuesta
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
            SELECT 
                g.Nombre, 
                g.Numero, 
                g.Sexo, 
                g.Color, 
                g.Peso, 
                g.Fecha AS FechaNacimiento, 
                g.Finca, 
                g.Tipo 
            FROM 
                ganado AS g
            WHERE 
                g.Tipo = 'Torete'
                AND g.Finca = ?;
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
            SELECT g.Nombre, g.Numero, g.Sexo, g.Color, g.Peso, g.Fecha AS FechaNacimiento, g.Finca
            FROM ganado AS g
            WHERE g.Tipo = 'Novilla'
            AND g.Finca = ?;
        `;
        const [rows] = await pool.query(query, [finca]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching ganado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// Reporte 5 - Placeholder para reportes futuros
router.get('/reporte5', async (req, res) => {
    const { numero } = req.query;

    if (!numero) {
        return res.status(400).json({ message: 'El parámetro número de ganado es requerido' });
    }

    try {
        // Consulta para obtener los datos del ganado por su número, incluyendo los partos estimados y demás relaciones
        const query = `
            SELECT 
                g.Nombre, 
                g.Numero, 
                g.Sexo, 
                g.Color, 
                g.Peso, 
                g.Fecha, 
                g.Tipo, 
                g.Finca, 
                g.Imagen, 
                g.Comentarios,

                -- Datos de los padres
                rp.Id_ganado_padre AS PadreId, 
                gp.Nombre AS NombrePadre, 
                rp.Id_ganado_madre AS MadreId, 
                gm.Nombre AS NombreMadre,
                
                -- Datos de leche
                l.Fecha AS FechaLeche, 
                l.Produccion_diaria AS ProduccionLeche,

                -- Datos de vacunación
                av.fecha_aplicacion AS FechaVacunacion, 
                av.tipo_vacuna AS TipoVacuna, 
                av.dosis AS DosisVacuna, 
                av.proxima_aplicacion AS ProximaVacuna,

                -- Datos de traslados
                t.Finca_origen AS FincaOrigen, 
                t.Finca_destino AS FincaDestino, 
                t.Fecha AS FechaTraslado,

                -- Datos de servicios
                s.Fecha AS FechaServicio, 
                ts.Nombre_tipo AS TipoServicio, 
                s.Condicion AS CondicionServicio, 
                s.Edad AS EdadServicio,
                
                -- Posible parto estimado
                DATE_ADD(s.Fecha, INTERVAL (9 - s.Edad) MONTH) AS FechaEstimadaParto,

                -- Datos de salidas
                sl.Fecha AS FechaSalida, 
                sl.Motivo AS MotivoSalida, 
                sl.Comentarios AS ComentariosSalida, 
                sl.Imagen AS ImagenSalida,

                -- Datos de ventas
                v.Fecha AS FechaVenta, 
                v.Comprador AS CompradorVenta, 
                v.Precio AS PrecioVenta, 
                v.Total AS TotalVenta

            FROM ganado g
            -- Unión para padres
            LEFT JOIN relacion_padres rp ON rp.Id_ganado_hijo = g.id
            LEFT JOIN ganado gp ON rp.Id_ganado_padre = gp.id
            LEFT JOIN ganado gm ON rp.Id_ganado_madre = gm.id

            -- Unión para leche
            LEFT JOIN leche l ON l.Id_ganado = g.id

            -- Unión para vacunación
            LEFT JOIN aplicacionvacunas av ON av.id_ganado = g.id

            -- Unión para traslados
            LEFT JOIN traslado t ON t.Id_ganado = g.id

            -- Unión para servicios
            LEFT JOIN servicios s ON s.Id_ganado = g.id
            LEFT JOIN tipo_servicio ts ON ts.id = s.Id_tipo_servicio

            -- Unión para salidas
            LEFT JOIN salidas sl ON sl.Id_ganado = g.id

            -- Unión para ventas
            LEFT JOIN venta v ON v.Id_ganado = g.id

            WHERE g.Numero = ?;
        `;

        // Ejecución de la consulta
        const [rows] = await pool.query(query, [numero]);

        if (rows.length > 0) {
            res.json(rows[0]); // Devolvemos los datos del primer registro (ya que el número es único)
        } else {
            res.status(404).json({ message: 'No se encontró el ganado con el número proporcionado' });
        }
    } catch (error) {
        console.error("Error fetching ganado data:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Reporte 6 leche ganado
router.get('/reporte6', async (req, res) => {
    const { numero } = req.query;

    if (!numero) {
        return res.status(400).json({ message: 'El parámetro numero es requerido' });
    }

    try {
        const query = `
            SELECT 
                g.Nombre,
                g.Numero,
                g.Sexo,
                g.Color,
                g.Peso,
                g.Fecha AS FechaNacimiento,
                g.Finca,
                g.Tipo,
                g.Imagen,  -- Incluimos la imagen del animal
                l.Fecha AS FechaProduccion,
                l.Produccion_diaria
            FROM 
                ganado AS g
            LEFT JOIN 
                leche AS l ON g.id = l.Id_ganado
            WHERE 
                g.Numero = ?
            ORDER BY 
                l.Fecha DESC;
        `;

        const [rows] = await pool.query(query, [numero]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching ganado and leche data:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
