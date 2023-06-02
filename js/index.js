import {  getLibros, saveLibro, deleteLibro, updateLibro } from './firebase_connection.js' // Imports the querys

const form = document.querySelector(".formulario") // Selects the form
const formApa = document.querySelector(".formApartar")
const btnAgregar = document.querySelector('.btnAdd') // Selects the button to add books
const Buscar = document.getElementById('inBuscador') 
const btnBorrar = document.querySelector('#btnDelete')
const btnCancelar = document.querySelector('#btnCancel') // Selects the button to cancel
const btnUpdate = document.querySelector('#btnUpdate')
const btnDevolver = document.querySelector('#btnDevolver')
const btnUsuarios = document.querySelector('#presLibros')

const resultsContainer = document.querySelector('.results')


//---------------Carga de tarjetas---------------------

const cardBook = document.querySelector('#cardBook').content
const cardBookPres = document.querySelector('#cardBookPres').content
const cardUsers = document.querySelector('#cardUsers').content
const contenido = document.querySelector('#contenido')
const contenedor = document.querySelector('#contenedor')
const fragment = document.createDocumentFragment()

let libros = []
let categoriaSeleccionada = '';
let librosDelete = {}
let librosUpdate = {}
let librosDev = {}

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

//Tarjetas para Books disponibles
const creaCards = (books) => {
    contenido.innerHTML = '';
    let librosDispon = []
    librosDispon = books.filter((libro) => libro.lib_disponibilidad == true)
    librosDispon.forEach((item) => {
        console.log(item)
        cardBook.querySelector('img').setAttribute('src', item.lib_img)
        cardBook.querySelector('.titulo').textContent = item.lib_titulo
        cardBook.querySelector('.category').textContent = item.lib_categoria
        cardBook.querySelector('.anio').textContent = item.lib_anio
        cardBook.querySelector('.author').textContent = item.lib_autor

        const clone = cardBook.cloneNode(true)
        clone.querySelector('#btnModal-delete').addEventListener('click', () => {
            librosDelete = item
            console.log('Libro para borrar =>', librosDelete)
        })
        clone.querySelector('#btnModal-update').addEventListener('click', () => {
            librosUpdate = item
            console.log('Libro para actualizar =>', librosUpdate.id)
        })
        fragment.appendChild(clone)
    })
    contenido.appendChild(fragment)
}

//Tarjetas para Books prestados
const creaCardsPres = (books) => {
    contenido.innerHTML = '';
    books.forEach((item) => {
        console.log(item)
        cardBookPres.querySelector('img').setAttribute('src', item.lib_img)
        cardBookPres.querySelector('.titulo').textContent = item.lib_titulo
        cardBookPres.querySelector('.category').textContent = item.lib_categoria
        cardBookPres.querySelector('.anio').textContent = item.lib_anio
        cardBookPres.querySelector('.author').textContent = item.lib_autor

        const clone = cardBookPres.cloneNode(true)
        fragment.appendChild(clone)
    })
    contenido.appendChild(fragment)
}

//Tarjetas para Usuarios
const creaUsers = (books) => {
    contenido.innerHTML = '';
    books.forEach((item) => {
        console.log(item)
        cardUsers.querySelector('img').setAttribute('src', item.pres_img)
        cardUsers.querySelector('.nombre').textContent = item.pres_nombre
        cardUsers.querySelector('.correo').textContent = item.pres_correo
        cardUsers.querySelector('.tel').textContent = item.pres_telefono
        cardUsers.querySelector('.domicilio').textContent = item.pres_domicilio
        cardUsers.querySelector('.fechaInicio').textContent = item.pres_fecha_inicio
        cardUsers.querySelector('.fechaFin').textContent = item.pres_fecha_fin

        cardUsers.querySelector('.tituloLib').textContent = item.lib_titulo
        const clone = cardUsers.cloneNode(true)
        clone.querySelector('#btnModal-devolver').addEventListener('click', () => {
            librosDev = item
            console.log('Libro para actualizar =>', librosDev.id)
        })
        fragment.appendChild(clone)
    })
    contenido.appendChild(fragment)
}


function main() {

    //creaCards(libros)
    btnAgregar.addEventListener('click', async () => {
        await insertBook()
        setTimeout(function () {
            window.location.reload()
        }, 1000)
    })

    //Función para buscar por nombre de libro o de autor
    Buscar.addEventListener('keyup', () => {
        console.log('Si llega aquí');
        let temp = libros.filter(book =>
            book && book.lib_titulo && book.lib_autor &&
            (book.lib_titulo.toLowerCase().includes(Buscar.value.toLowerCase()) ||
            book.lib_autor.toLowerCase().includes(Buscar.value.toLowerCase()))
        );
        resultsContainer.innerHTML=''
        creaCards(temp);
        

    });


}
// ---------------- Funciones ------------------
btnUsuarios.addEventListener('click', async() => {
    let librosPrestados = []
    librosPrestados = libros.filter((libro) => libro.lib_disponibilidad == false);
    creaUsers(librosPrestados);
})

btnBorrar.addEventListener('click', async() => {
    console.log('Entra al EventListener de btnBorrar')
    await deleteLibro(librosDelete)
    librosDelete = {}
    window.location.reload()
})

btnCancelar.addEventListener('click', () => {
    librosDelete = {}
})

btnUpdate.addEventListener('click', async() => {
    console.log('Entra al EventListener de btnBorrar')
    await updateBook(librosUpdate)
    librosUpdate = {}
    //window.location.reload()
})

btnDevolver.addEventListener('click', async() => {
    console.log('Entra al EventListener de btnDevolver')
    await returnBook(librosDev)
    librosDev = {}
    window.location.reload()
})


// Funcion para añadir un libro
async function insertBook() {
    // Data to be added to the database
    const sendData = {
        lib_anio: form.anio.value,
        lib_autor: form.autor.value,
        lib_categoria: form.categ.value,
        lib_img: form.portada.value,
        lib_titulo: form.titulo.value,
        lib_disponibilidad: true,
        lib_descrip: null,
        // 
        pres_img: null,
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

// Funcion para actualizar un libro
async function updateBook() {
    // Data to be added to the database
    const sendData = {
        id: librosUpdate.id,
        lib_disponibilidad: false,
        // 
        pres_img: formApa.imagen.value,
        pres_correo: formApa.correo.value,
        pres_domicilio: formApa.domicilio.value,
        pres_fecha_fin: formApa.fechaFin.value,
        pres_fecha_inicio: formApa.fechaInicio.value,
        pres_nombre: formApa.name.value,
        pres_telefono: formApa.telefono.value
    }
    await updateLibro(sendData)
}

// Funcion para borrar un prestamo
async function returnBook() {
    // Data to be added to the database
    const sendData = {
        id: librosDev.id,
        lib_disponibilidad: true,
        // 
        pres_img: null,
        pres_correo: null,
        pres_domicilio: null,
        pres_fecha_fin: null,
        pres_fecha_inicio: null,
        pres_nombre: null,
        pres_telefono: null
    }
    await updateLibro(sendData)
}



//Evento click en las categorías del menú lateral
document.querySelectorAll('.container-menu nav a').forEach((categoria) => {
    categoria.addEventListener('click', (e) => {
      e.preventDefault();
      categoriaSeleccionada = categoria.textContent
  
      // Vaciar la sección de resultados
      resultsContainer.innerHTML=''
  
      // Agregar el título de la categoría
      const tituloCategoria = document.createElement('h1')
      tituloCategoria.textContent = categoriaSeleccionada;
  
      tituloCategoria.classList.add('category-title')
      tituloCategoria.classList.add('fade-in')

      resultsContainer.appendChild(tituloCategoria)

      const navDivider = document.createElement('nav');
      navDivider.classList.add('nav-divider');
      navDivider.classList.add('centrado');
      resultsContainer.appendChild(navDivider);
  
      if (categoriaSeleccionada === 'Prestados') {
        let librosPrestados = []
        librosPrestados = libros.filter((libro) => libro.lib_disponibilidad == false)
        creaCardsPres(librosPrestados)
      } else {
        let librosFiltrados = []
        librosFiltrados = libros.filter((libro) => libro.lib_categoria === categoriaSeleccionada)
        creaCards(librosFiltrados)
      }
  
      const menuCheckbox = document.getElementById('btn-menu')
      menuCheckbox.checked = false; // Cierra el menú al hacer clic en una categoría
    })
  })
  
  
  
  
  



