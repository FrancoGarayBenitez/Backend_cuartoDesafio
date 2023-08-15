const fs = require('fs').promises

class Contenedor {
    constructor(file) {
        this.file = file
    }

    async save(object) {
        try {
            //Obtengo información del array
            const objects = await this.getAll()
            //Obtengo Id del último objeto
            const lastId = objects.length > 0 ? objects[objects.length - 1].id : 0
            //Creamos el ID al nuevo objeto en base al último.
            const newId = lastId + 1

            //Creamos el nuevo objeto con los parámetros recibidos
            const newObj = {
                id: newId,
                ...object
            }

            //Lo guardamos en el array y actualizamos json.
            objects.push(newObj)
            await this.saveObjects(objects)

        } catch (error) {
            return new Error("Error al guardar el objeto")
        }
    }

    async getById(id_obj) {
        try {
            //Obtengo información del array
            const objects = await this.getAll()
            //Buscamos el objeto cuyo ID coincida con el ID recibido por parámetro.
            const foundById = objects.find((obj) => obj.id === id_obj)
            return foundById

        } catch (error) {
            return new Error("Error al obtener objeto por Id.")
        }
    }

    async getAll() {
        try {
            //Obtenemos la información del archivo pasado por parámetro al constructor
            const data = await fs.readFile(this.file, "utf-8")
            return data ? JSON.parse(data) : []

        } catch (error) {
            return []
        }
    }

    async deleteById(id_obj) {
        try {
            //Obtenemos el array con los objetos
            let objects = await this.getAll()
            //Modificamos el array original eliminando el objeto indicado por parámetro.
            objects = objects.filter((obj) => obj.id !== id_obj)
            //Actualizamos el array en el archivo
            await this.saveObjects(objects)

        } catch (error) {
            return new Error("Error al eliminar el objeto.")
        }
    }

    async deleteAll() {
        try {
            //Vaciamos el archivo.
            await this.saveObjects([])
        } catch (error) {
            return new Error("Error al eliminar los objetos.")
        }
    }

    async saveObjects(objects) {
        try {
            await fs.writeFile(this.file, JSON.stringify(objects, null, 2))
        } catch (error) {
            return new Error("Error al guardar objetos.")
        }
    }

}

//Exportamos instancias
const products = new Contenedor("productos.json")

module.exports = { products }