const express = require('express')
const app = express()
const PORT = 8080
const path = require('path')
const handlebars = require('express-handlebars')

//Middleware para analizar el cuerpo de las solicitudes.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Import socket.io
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

//Config Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "handlebars")
app.use(express.static(path.join(__dirname, 'public')))

const products = []

//Routing
app.get("/", (req, res) => {
    res.render("home", { products })
})

app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
})

//Config socket.io
io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    socket.on("newProduct", (product) => {
        const lastId = products.length > 0 ? products[products.length - 1].id : 0
        const newId = lastId + 1

        product = {
            id: newId,
            ...product
        }

        products.push(product)

        //Emitir a todos los clientes
        io.emit("productsList", products)
    })

    socket.on("deleteProduct", (id_product) => {
        const item = products.find((p) => p.id === id_product)
        const indexProduct = products.indexOf(item)
        products.splice(indexProduct, 1)
        io.emit("productsList", products)
    })
})

server.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})