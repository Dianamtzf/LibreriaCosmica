import {  getLibros, saveLibro, deleteLibro, updateLibro } from './firebase_connection.js' // Imports the querys

const form = document.querySelector(".formulario") // Selects the form
const btnAgregar = document.querySelector('.btnAdd') // Selects the button to add books
const Buscar = document.getElementById('inBuscador') 

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
})

// --------------- Scroll up button ---------------

document.getElementById("button-up").addEventListener("click", scrollUp)

function scrollUp() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop
    if(currentScroll > 0) {
        window.requestAnimationFrame(scrollUp)
        window.scrollTo(0, currentScroll - (currentScroll / 5))
        buttonUp.style.transform = "scale(0)"
    }
}

var buttonUp = document.getElementById("button-up")

window.onscroll = function() {
    var scroll = document.documentElement.scrollTop
    if(scroll > 200) {
        buttonUp.style.transform = "scale(1)"
    } else if (scroll < 200) {
        buttonUp.style.transform = "scale(0)"
    }
} 



function main() {

    // Aquí van las llamadas a las demás funciones y listeners
    creaCards(libros)


    btnAgregar.addEventListener('click', async () => {
        await insertBook()
        setTimeout(function () {
            window.location.reload()
        }, 1000)
    })
    creaCards(libros)
    /*btnAgregar.addEventListener('click', e => {
        e.preventDefault(); // Evita que se refresque la página
        insertBook()
    })*/

    //Función para buscar por nombre de libro o de autor
    Buscar.addEventListener('keyup', () => {
        console.log('Si llega aquí');
        let temp = libros.filter(book => 
            book.lib_titulo.toLowerCase().includes(Buscar.value.toLowerCase()) ||
            book.lib_autor.toLowerCase().includes(Buscar.value.toLowerCase())
        );
        creaCards(temp);
    });


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
document.querySelectorAll('.dropdown-content li').forEach((categoria) => {
  categoria.addEventListener('click', (e) => {
    e.preventDefault();
    categoriaSeleccionada = categoria.textContent;
    if(categoriaSeleccionada == 'Prestados'){
        let librosPrestados = []
        librosPrestados = libros.filter((libro) => libro.lib_disponibilidad == false);
        creaCards(librosPrestados);
    } else {
        let librosFiltrados = []
        librosFiltrados = libros.filter((libro) => libro.lib_categoria === categoriaSeleccionada);
        creaCards(librosFiltrados);
    }
  });
});

//Tarjetas
const creaCards = (books) => {
    contenido.innerHTML = '';
    books.forEach((item) => {
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



