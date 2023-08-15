const express = require('express')
const app = express()
const PORT = 8080
const path = require('path')
const handlebars = require('express-handlebars')

//Middleware para analizar el cuerpo de las solicitudes.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Import contenedor de productos
const { products } = require('./public/contenedor.router')

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

//Routing
app.get("/", async (req, res) => {
    const data = await products.getAll()
    res.render("home", { data })
})

app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
})



//Config socket.io
io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    //Recibir producto
    socket.on("newProduct", async (product) => {
        await products.save(product)
        const data = await products.getAll()

        //Emitir a todos los clientes
        io.emit("productsList", data)
    })

    //Recibir id del producto y eliminarlo
    socket.on("deleteProduct", async (id_product) => {
        console.log(id_product);
        await products.deleteById(id_product)
        const data = await products.getAll()
        io.emit("productsList", data)
    })
})

server.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})
