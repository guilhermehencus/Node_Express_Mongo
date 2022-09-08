'use strict' /* auxilia no desenvolvimento do codigo node.js avisando sobre a falta
de declaração de variáveis */

const http = require('http');
const app = require('../app_folder/app');
const debug = require('debug')('nodestr: server');
const express = require('express');
const port = normalizePort(process.env.PORT || '3000'); /* process.env.PORT, vai ter uma porta definida  */
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);
console.log("Sucesso " + port);
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port>= 0) {
        return port;
    }
    return false;
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
    ? 'pipe' + addr
    : 'port' + addr.port;
    debug('Listening' + bind) 
}