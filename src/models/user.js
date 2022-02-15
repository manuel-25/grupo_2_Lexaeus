const path = require('path')
const fs = require('fs') //Leer y escribir archivo .json
const res = require('express/lib/response')
const validator = require('express-validator');

const model = {
    listar: () => JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'users.json'))),
    mostrar: id => model.listar().find(e => e.id == id),
    mostrarPorEmail: email => model.listar().find(e => e.email == email),
    guardar: data => {
        let all = model.listar()
        let id = all.length > 0 ? all[all.length - 1].id + 1 : 1

        let image = "/img/users/default-img.jpg"
        let esAdmin = false
        let nombre = data.nombre
        let apellido = data.apellido
        let email = data.email
        let password = data.clave
        let user = { id: id, nombre, apellido, email, password, image, esAdmin }
        all.push(user)
        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'users.json'), JSON.stringify(all, null, 2))
    },
    editar: (req, res) => {
        let usuarioAEditar = model.mostrar(req.params.idPerfil);

        usuarioAEditar.image = '/img/users/' + req.file.filename;

        let all = model.listar()

        for (let i = 0; i < all.length; i++) {
            if (all[i].id == req.params.idPerfil) {
                all[i] = usuarioAEditar;
                console.log(usuarioAEditar)
            }
        }

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'users.json'), JSON.stringify(all, null, 2));
    },
    validator: [
        validator.body("email").isEmail().withMessage("Introduzca un mail valido."),
        validator.body("clave").isLength({min:5}).withMessage("La contraseña debe ser mayor a 5 caracteres.")
    ]

}

module.exports = model