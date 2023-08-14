const socket = io()

//Enviar producto creado desde el cliente al servidor
document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault()

    let newProduct = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        status: document.getElementById("status").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    }

    socket.emit("newProduct", newProduct)
})


//Inyectar en html
function appendProduct(data) {
    const productList = document.getElementById("products-list")
    const productElement = document.createElement("div")
    productElement.innerHTML = ""

    data.forEach((p) => {
        productElement.innerHTML =
            `
                <h2>${p.title}</h2>
                <p> <strong>ID:</strong> ${p.id}</p> 
                <p> <strong>Descripción:</strong> ${p.description}</p>
                <p> <strong>Code:</strong> ${p.code}</p>
                <p> <strong>Price:</strong> ${p.price}</p>
                <p> <strong>Status:</strong> ${p.status}</p>
                <p> <strong>Stock:</strong> ${p.stock}</p>
                <p> <strong>Category:</strong> ${p.category}</p>
                <button id="btnRemove${p.id}">Eliminar</button>
                `
        productList.appendChild(productElement)

        const btnRemove = document.getElementById(`btnRemove${p.id}`)

        btnRemove.addEventListener("click", () => {
            socket.emit("deleteProduct", p.id)
            productElement.innerHTML = ""
        })
    });

}


//Recibir productos desde el servidor
socket.on("productsList", (products) => {
    appendProduct(products)
})