const path = require('path')
const fs = require('fs') //Leer y escribir archivo .json
const res = require('express/lib/response')

const model = {
    listar: () => JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'products.json'))),
    mostrar: id => model.listar().find(e => e.id == id),
    guardar: data => {
        let all = model.listar()
        let id = all.length > 0 ? all[all.length - 1].id + 1 : 1
        let product = { id: id, ...data }
        all.push(product)
        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'products.json'), JSON.stringify(all, null, 2))
    },
    modificar: (req, res) => {

        let productoAEditar = model.mostrar(req.params.id);

        productoAEditar.nombre = req.body.nombre;
        productoAEditar.categoria = req.body.categoria;
        productoAEditar.precio = req.body.precio;
        productoAEditar.img = req.body.img;
        productoAEditar.descripcion = req.body.descripcion;
        productoAEditar.stock = req.body.stock;
        productoAEditar.talle = req.body.talle;
        productoAEditar.color = req.body.color;

        let all = model.listar()

        for (let i = 0; i < all.length; i++) {
            if (all[i].id == req.params.id) {
                all[i] = productoAEditar;
            }
        }

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'products.json'), JSON.stringify(all, null, 2));
    },

    eliminar: (req, res) => {
        let idProductoAEliminiar = req.params.id;

        let all = model.listar();

        let productos = [];

        for (let i = 0; i < all.length; i++) {

            if (all[i].id != idProductoAEliminiar) {
                productos.push(all[i]);
            }

        }

        fs.writeFileSync(path.resolve(__dirname, '..', 'data', 'products.json'), JSON.stringify(productos, null, 2));

    }
}

module.exports = model