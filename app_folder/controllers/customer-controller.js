'use strict';

const ValidationContract = require('../validation/validation.js');
const repository = require('../repositories/customer-repository.js');
const md5 = require('md5');
const authService = require('../services/auth-service.js');
const { decodeToken } = require('../services/auth-service.js');
const emailService = require('../services/email-services.js');
exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, "Precisa ter pelo menos três caracteres");
    contract.isEmail(req.body.email,'Email inválido');
    contract.hasMinLen(req.body.password, 6, "Precisa ter pelo menos seis caracteres");
    /*  Caso for invállido */
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end;
        return;
    }
    try {
        await repository.create({ 
            name: req.body.name, 
            email: req.body.email, 
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        });
            emailService.send(
                req.body.email, 
                "Bem vindo ao node store", 
                global.EMAIL_TMPL.replace('{0}', req.body.name));
            /* replace: função que ajuda colocar o nome no template email */
        res.status(201).send({ message: 'Cliente cadastrado com sucesso'});
    } catch(e){
        res.status(500).send({message: ' Falha no cadastramento do cliente'});
        /* função de erro */    
    }
}
exports.authenticate = async(req, res, next) => {
    try {
        const customer = await repository.authenticate({ 
            email: req.body.email, 
            password: md5(req.body.password + global.SALT_KEY)});
            const token = await authService.generateToken({
               id: customer._id,
               email: customer.email, 
               name: customer.name,
               roles: customer.roles
            });
            if (!customer) {
                res.status(404).send({message: "Email ou senha inválido"});
                return;
            }
            res.status(201).send({
                token: token, 
                data: {
                    email: customer.email, 
                    name: customer.name
                }
            });
    } catch(e){
        res.status(500).send({message: 'Email ou senha inválido' });
        /* função de erro */    
    }
}
exports.refreshToken = async(req, res, next) => {
    try {
         /* recuperar o token */
         const token = req.body.token || req.query.token || req.headers['x-access-token'];
         /* decodifica o token */
         const data = await authService.decodeToken(token);
        const customer = await repository.getById(data.id);
            if (!customer) {
                res.status(404).send({message: "Cliente não encontrado"});
                return;
            }
            const tokenData = await authService.generateToken({
                id: customer._id,
                email: customer.email, 
                name: customer.name,
                roles: customer.roles
             });
            res.status(201).send({
                token: tokenData, 
                data: {
                    email: customer.email, 
                    name: customer.name
                }
            });
    } catch(e){
        console.log(e);
        res.status(500).send({message: 'Cliente não encontrado' });
        /* função de erro */    
    }
}