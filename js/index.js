import {  getLibros, saveLibro } from './firebase_connection.js' // Imports the querys

const form = document.querySelector(".formulario") // Selects the form
const btnAgregar = document.querySelector('.btnAdd') // Selects the button to add books

//---------------Carga de tarjetas---------------------

const cardBook = document.querySelector('#cardBook').content
const contenido = document.querySelector('#contenido')
const fragment = document.createDocumentFragment()

let libros = []
let categoriaSeleccionada = '';

document.addEventListener('DOMContentLoaded', async (e) => {
    libros = await getLibros()
    console.log('libros:', libros)
    main()

    const enlacesCategoria = document.querySelectorAll('a[data-value]');
    enlacesCategoria.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = enlace.dataset.value;
            filtrarPorCategoria(categoria);
        });
    });
})


const main = () => {

    // Aquí van las llamadas a las demás funciones y listeners
    creaCards()


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
        // 
        pres_correo: null,
        pres_domicilio: null,
        pres_fecha_fin: null,
        pres_fecha_inicio: null,
        pres_nombre: null,
        pres_telefono: null
    }
    await saveLibro(sendData)
    form.reset()
}



//Evento click en las categorías del menú lateral
document.querySelectorAll('.container-menu nav a').forEach((categoria) => {
  categoria.addEventListener('click', (e) => {
    e.preventDefault();
    categoriaSeleccionada = categoria.textContent;
    contenido.innerHTML = '';
    creaCards();
  });
});

//Tarjetas
const creaCards = () => {
    let librosFiltrados = libros;
  
    // Filtrar los libros por categoría seleccionada
    if (categoriaSeleccionada) {
      librosFiltrados = libros.filter((libro) => libro.lib_categoria === categoriaSeleccionada);
    }

    librosFiltrados.forEach((item) => {
        console.log(item)
        cardBook.querySelector('img').setAttribute('src', item.lib_img)
        cardBook.querySelector('.titulo').textContent = item.lib_titulo
        cardBook.querySelector('.category').textContent = item.lib_categoria
        cardBook.querySelector('.anio').textContent = item.lib_anio
        cardBook.querySelector('.author').textContent = item.lib_autor

        const clone = cardBook.cloneNode(true)
        fragment.appendChild(clone)
    })
    contenido.appendChild(fragment)
}



