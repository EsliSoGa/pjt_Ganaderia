const express = require('express');
const app = express();
const cors = require('cors');


//var usuarioRoute = require('./routes/usuario');

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

//app.use('/usuario', usuarioRoute);

app.listen(app.get('port'), () => {
    console.log('Port:', app.get('port'));
});