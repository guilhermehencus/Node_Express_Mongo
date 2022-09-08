'use strict'
/* nodemon: se salva algo executa o servidor automático */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.js');
/* Conexão com bancco */
mongoose.connect(config.connectionString);
const app = express();
/* Carrega os modais */
const Product = require('./models/product.js');
const Customer = require('./models/customer.js');
const Order = require('./models/order.js');
/* Carregar as rotas  */
const index = require('./route/index.js');
const products = require('./route/products.js');
const customer = require('./route/customer-route.js');
const order = require('./route/order-route.js');
app.use(bodyParser.json({
    limit: '10mb' /* carregamento das requisições, contando imagens a ser processadas */
}));
// Habilita o CORS
/* liberação das URLs */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); /*  acessar o site*/
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', index);
app.use('/products', products);
app.use('/customer', customer);
app.use('/orders', order);
module.exports = app;