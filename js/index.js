import {  getLibros, saveLibro } from './firebase_connection.js' // Imports the querys

const form = document.querySelector(".formulario") // Selects the form
const btnAgregar = document.querySelector('.btnAdd') // Selects the button to add products (there needs to add an id to the button in the principal.html)


let libros = []

document.addEventListener('DOMContentLoaded', async (e) => {
    libros = await getLibros()
    console.log('libros:', libros)
    main()
})


const main = () => {

    // Aquí van las llamadas a las demás funciones y listeners

    btnAgregar.addEventListener('click', e => {
        e.preventDefault(); // Evita que se refresque la página
        insertBook()
    })
}
// ---------------- Funciones ------------------

// Funcion para añadir un libro
const insertBook = async () => {
    // Data to be added to the database
    const sendData = {
        lib_anio: form.anio.value,
        lib_autor: form.autor.value,
        lib_categoria: form.categ.value,
        lib_img: form.portada.value,
        lib_titulo: form.titulo.value,
        lib_disponibilidad: true,
        // Para el modal de rentar un libro
        pres_correo: null,
        pres_domicilio: null,
        pres_fecha_fin: null,
        pres_fecha_inicio: null,
        pres_nombre: null,
        pres_telefono: null,

    }
    await saveLibro(sendData)
    form.reset()
}
