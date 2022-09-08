'use strict';

const repository = require('../repositories/order-repository.js');
const guid = require('guid'); /* biblioteca de geração de números */
const { decodeToken } = require('../services/auth-service.js');
const authService = require('../services/auth-service.js');
exports.get = async(req, res, nex) => {
    try {
    var data = await repository.get();
    res.status(200).send(data);
    } catch (e) {
        res.status(500).send({message: ' Falha no processamento'});
    }
}
exports.post = async(req, res, next) => {
    try {
        /* recuperar o token */
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        /* decodifica o token */
        const data = await authService.decodeToken(token);
        await repository.create({customer: data.id,
        number: guid.raw().substring(0,6), /* 6 caracteres */
        itens: req.body.itens});
        res.status(201).send({ message: 'Pedido cadastrado com sucesso'});
    } catch(e){
        res.status(500).send({message: ' Falha no pedido'});
        /* função de erro */    
    }
}