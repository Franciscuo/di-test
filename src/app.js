require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const db = require('./database/config');

//Initialization
const app = express();
if (process.env.NODE_ENV != 'test') {
    app.use(morgan('dev'));
}
db.connect();

//Settings 
app.set('AppName', 'Ditech');


//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use('/api_v1', require('./api/v1/routes/items.routes'));
app.use('/api_v1_1', require('./api/v1.1/routes/items.routes'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;