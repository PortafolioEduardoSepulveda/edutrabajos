const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');
const path = require('path')
let transport = nodemailer.createTransport({
    host : emailConfig.host,
    port : emailConfig.port,
    auth: {
        user : emailConfig.user,
        pass: emailConfig.pass
    }
});


const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./views/emails'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/emails'),
    extName: ".handlebars",
};

transport.use('compile', hbs(handlebarOptions));


exports.enviar = async (opciones) => {

    const opcionesEmail = {
        from:'eduTrabajos <noreply@eduTrabajos.com',
        to: opciones.usuario.email,
        subject : opciones.subject, 
        template: opciones.archivo,
        context: {
            resetUrl : opciones.resetUrl
        },
    };

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesEmail);
   
}

