'use strict';

const ValidationContract = require('../validation/validation.js');
const repository = require('../repositories/product-repository.js');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config.js');
exports.get = async(req, res, nex) => {
    try {
    var data = await repository.get();
    res.status(200).send(data);
    } catch (e) {
        res.status(500).send({message: ' Falha no processamento'});
    }
}
exports.getBySlug = async(req, res, nex) => {
    try {
     var data = await repository.getBySlug(req.params.slug);  
        res.status(200).send(data);
    } catch(e){
        res.status(500).send({message: ' Falha no processamento'});
        /* função de erro */
    }
}
exports.getById = async(req, res, nex) => {
    try {
    var data = await repository.getById(req.params.id);
    res.status(200).send(data);
    } catch(e){
        res.status(500).send({message: ' Falha no processamento'});
        /* função de erro */
    }
}
exports.getByTag = async(req, res, nex) => {
    try {
    var data = await repository.getByTag(req.params.tags);
    res.status(200).send(data);
    } catch(e){
    res.status(500).send({message: ' Falha no processamento'});
    /* função de erro */    
    }
}
exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, "Precisa ter pelo menos três caracteres");
    contract.hasMinLen(req.body.slug, 3, "Precisa ter pelo menos três caracteres");
    contract.hasMinLen(req.body.description, 3, "Precisa ter pelo menos três caracteres");
    /*  Caso for invállido */
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end;
        return;
    }
    try {
        // Cria o Blob Service
        const blobSvc = azure.createBlobService(config.containerConnectionString);
        let filename = guid.raw().toString() + '.jpg'; /* nome do arquivo: 32 caracteres */
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/); /* cabeçalho, remover itens desnecessários */
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
        // Salva a imagem
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });

        await repository.create({ 
            title: req.body.title, 
            slug: req.body.title, 
            description: req.body.description,
            price: req.body.price, 
            active: true, 
            tags: req.body.tags, 
            image: 'https://guinodestr.blob.core.windows.net/product-images/'+filename
        }); 
        res.status(201).send({ message: 'Produto cadastrado com sucesso'});
    } catch(e){
        console.log(e);
        res.status(500).send({message: ' Falha no cadastramento do produto'});
        /* função de erro */    
    }
}
exports.put = async(req, res, next) => { 
    try {
        await repository.update(req.params.id, req.body);
        res.status(201).send({ message: 'Produto atualizado com sucesso'});
    }
    catch(e){
        res.status(500).send({message: ' Falha em atualizar o produto'});
        /* função de erro */    
    }
}
exports.delete = async (req, res, next) => { 
    try {
        repository.delete(req.params.id);
        res.status(200).send({message: "Produto removido com sucesso"});
    }
    catch(e){
       res.status(500).send({message: "Falha ao remover"});
       /* função de erro */
   }
}
/*
repository.getBySlug(req.params.slug).then(data =>{ 
        res.status(200).send(data);
    }).catch(e => {
        res.status(400).send(e);
        função de erro 
    }); }; */
    