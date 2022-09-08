'use strict';

global.SALT_KEY = ''; /* chave interna */
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem vindo à Node Store!'; /* template de email */

module.exports = {
    connectionString: '', /*  Conexão */
    sendgridKey: '', /* enviar email */
    containerConnectionString: '' /* armazenar imagem do produto */
}