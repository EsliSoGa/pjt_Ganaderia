const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

var usuarioRoute = require('./routes/usuario');
var tipo_servicioRoute = require('./routes/tipoServicio');
var servicioRoute = require('./routes/servicio');
var ganadoRoute = require('./routes/ganado');
var lecheRoute = require('./routes/leche');  // Asegúrate de incluir la ruta de leche
var padreRoute = require('./routes/padres');
var ventasRoute = require('./routes/ventas');
var tmpventasRoute = require('./routes/tempVenta');
var salidaRoute = require('./routes/salida');
var tmpsalidaRoute = require('./routes/tempSalida');
var trasladoRoute = require('./routes/traslado');
var bitacoraRoute = require('./routes/bitacora');
var actividadesRoute = require('./routes/actividades');

const cookieSession = require("cookie-session");

app.set('port', process.env.PORT || 8080);
var corsOptions = {
    origin: "http://localhost:8081",
    methods: ['GET','POST','DELETE','UPDATE','PUT']
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(
    cookieSession({
        name: "prueba-session",
        secret: "COOKIE_SECRET",
        httpOnly: true,
        sameSite: 'strict'
    })
)

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/usuario', usuarioRoute);
app.use('/tipoServicio', tipo_servicioRoute);
app.use('/servicio', servicioRoute);
app.use('/ganado', ganadoRoute);
app.use('/leche', lecheRoute); 
app.use('/padres', padreRoute);
app.use('/venta', ventasRoute);
app.use('/tmpVenta', tmpventasRoute);
app.use('/salida', salidaRoute);
app.use('/tmpSalida', tmpsalidaRoute);
app.use('/actividades', actividadesRoute);
app.use('/traslado', trasladoRoute);
app.use('/bitacora', bitacoraRoute);

app.listen(app.get('port'), () => {
    console.log('Port:', app.get('port'));
});
