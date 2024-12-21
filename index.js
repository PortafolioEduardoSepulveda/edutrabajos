const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const HttpError = require('http-errors');
const passport = require('./config/passport');

const app = express();

require('dotenv').config({ path : 'variables.env'});
 

    // validación de campos
    app.use(expressValidator());

    // habilitar body-parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //habilitar handlebars como view
    app.engine('handlebars',engine({ 
        defaultLayout: "layout",
        helpers: require('./helpers/handlebars'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
          }

    }));
    app.set('view engine', 'handlebars');
    app.set("views", "./views");

    // static files
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(cookieParser());

    const sessionStore = MongoStore.create({
    client: mongoose.connection.client
    })

    app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
       maxAge: 1000 * 60 * 60 * 24 //Equals 24 hours
    }
    }));

    // inicializar passport
    app.use(passport.initialize());
    app.use(passport.session());
    // Alertas y flash messages
    app.use(flash());

    // Crear nuestro middleware
    app.use((req, res, next) => {
        res.locals.mensajes = req.flash();
        next();
    });

    app.use('/',router());

      
    // 404 pagina no existente
app.use((req, res, next) => {
     next(HttpError(404, 'No Encontrado'));
});




app.listen(process.env.PUERTO);