const path = require('path');
const user = require('../models/user')
const fs = require('fs');
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const validator = require('express-validator');

const controller = {
    login: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "login"))
    },

    register: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "register"))
    },
    profile: (req, res) => {
        res.render(path.resolve(__dirname, "..", "views", "users", "profile"), { usuarioAMostrar: req.session.userLogged })
    },
    crearUsuario: (req, res) => {

        let errors = validator.validationResult(req).mapped();

        if (errors.length > 0) {

           return res.render(path.resolve(__dirname, "..", "views", "users", "register"), {errors})
        }

        if (req.body.clave == req.body.confirmar) {

            req.body.clave = bcrypt.hashSync(req.body.clave, 10);

            user.guardar(req.body)

            let urlRedireccionar = '/users/profile/';

            res.redirect(urlRedireccionar);

        } else {
            res.send('Las constraseñas no son iguales')
        }

    },
    actualizarPerfil: (req, res) => {

        if (req.file == undefined) {

            req.file.filename = "/img/users/default-img.jpg"

        }

        user.editar(req, res);

        let urlARedireccionar = '/users/profile';

        res.redirect(urlARedireccionar);
    },

    validarLogin: (req, res) => {

        

        let usuario = user.mostrarPorEmail(req.body.email);

        let errors = validationResult(req)

        if (errors.isEmpty()) {

            if (usuario != undefined) {

                if (bcrypt.compareSync(req.body.clave, usuario.password)) {

                    req.session.userLogged = usuario;
                    res.redirect('/users/profile')

                } else {
                    res.render(path.resolve(__dirname, "..", "views", "users", "login"), { errorclave: { clave: { msg: "Clave incorrecta" } } })
                }

            } else {
                res.render(path.resolve(__dirname, "..", "views", "users", "login"), { erroremail: { email: { msg: "Email inexistente" } } })
            }

        } else {
            res.render(path.resolve(__dirname, "..", "views", "users", "login"), { errors: errors.array() })
        }

        if(req.body.remember){
            res.cookie("email", req.body.email, {maxAge: 1000*60*60})
        }

        req.session.user = user.mostrarPorEmail(req.body.email)

        return req.session.user



    }
}

module.exports = controller;