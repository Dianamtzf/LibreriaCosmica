import {  getLibros, saveLibro, deleteLibro, updateLibro, updatePrestamo, updateUsuario } from './firebase_connection.js' // Imports the querys

const form = document.querySelector(".form") // Selects the form
const formApa = document.querySelector(".formApartar")
const formRen = document.querySelector(".formRenovar")
const formActualizar = document.querySelector(".formActualizar")
const btnAgregar = document.querySelector('.btnAdd') // Selects the button to add books
const Buscar = document.getElementById('inBuscador') 
const btnBorrar = document.querySelector('#btnDelete')
const btnCancelar = document.querySelector('#btnCancel') // Selects the button to cancel
const btnUpdate = document.querySelector('#btnUpdate')
const btnDevolver = document.querySelector('#btnDevolver')
const btnRenew = document.querySelector('#btnRenew')
const btnActualizar = document.querySelector('#btnActualizar')
const btnUsuarios = document.querySelector('#presLibros')
const addButton =  document.getElementById('btnAdd')
const resultsContainer = document.querySelector('.results')
const btnUp = document.getElementById('btnUpdate');
const btnAct = document.getElementById('btnActualizar');
const btnRen = document.getElementById('btnRenew');

//---------------Carga de tarjetas---------------------

const cardBook = document.querySelector('#cardBook').content
const cardBookPres = document.querySelector('#cardBookPres').content
const cardUsers = document.querySelector('#cardUsers').content
const contenido = document.querySelector('#contenido')
const fragment = document.createDocumentFragment()

let libros = []
let categoriaSeleccionada = '';
let librosDelete = {}
let librosUpdate = {}
let librosDev = {} //libro para devolver
let librosRen = {} //libro para renovar
let userUpd = {} //usuario para actualizar

document.addEventListener('DOMContentLoaded', async (e) => {
    libros = await getLibros()
    console.log('libros:', libros)
    creaCards(libros)
    main()
})


// --------------- Scroll up button ---------------

document.getElementById("button-up").addEventListener("click", scrollUp)

function scrollUp() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop
    if(currentScroll > 0) {
        window.requestAnimationFrame(scrollUp)
        window.scrollTo(0, 0)
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
            console.log('Libro para actualizar =>', librosUpdate.id, librosUpdate.lib_titulo)
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
        clone.querySelector('#btnModal-renovar').addEventListener('click', () => {
            librosRen = item
            console.log('Libro para renovar =>', librosRen.pres_nombre)
        })
        clone.querySelector('#btnModal-actualizar').addEventListener('click', () => {
            userUpd = item;

            // Asignar los valores del usuario al formulario del modal
            document.getElementById('name').value = userUpd.pres_nombre;
            document.getElementById('imagen').value = userUpd.pres_img;
            document.getElementById('correo').value = userUpd.pres_correo;
            document.getElementById('telefono').value = userUpd.pres_telefono;
            document.getElementById('domicilio').value = userUpd.pres_domicilio;

            console.log('Usuario para actualizar =>', userUpd.pres_nombre);
        });
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
     
    //

}
// ---------------- Funciones ------------------
btnUsuarios.addEventListener('click', async () => {
    let librosPrestados = [];
    librosPrestados = libros.filter((libro) => libro.lib_disponibilidad == false);
    resultsContainer.innerHTML = '';
    creaUsers(librosPrestados);
  
    const tituloCategoria = document.createElement('h1');
    tituloCategoria.textContent = "Sistema de Usuarios";
    tituloCategoria.classList.add('category-title');
    resultsContainer.appendChild(tituloCategoria);
    const navDivider = document.createElement('nav');
    navDivider.classList.add('nav-divider');
    navDivider.classList.add('centrado');
    resultsContainer.appendChild(navDivider);
  });
  

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
    console.log('Entra al EventListener de btnUpdate')
    await updateBook(librosUpdate)
    librosUpdate = {}
    setTimeout(function () {
        window.location.reload()
    }, 1000)
})

btnActualizar.addEventListener('click', async() => {
    console.log('Entra al EventListener de btnActualizar')
    await updateUser(userUpd)
    userUpd = {}
    setTimeout(function () {
        window.location.reload()
    }, 1000)
})

btnDevolver.addEventListener('click', async() => {
    resultsContainer.innerHTML=''
    console.log('Entra al EventListener de btnDevolver')
    await returnBook(librosDev)
    librosDev = {}
    setTimeout(function () {
        window.location.reload()
    }, 1000)
    
})

btnRenew.addEventListener('click', async() => {
    resultsContainer.innerHTML=''
    console.log('Entra al EventListener de btnRenew')
    await renewBook(librosRen)
    librosRen = {}
    setTimeout(function () {
        window.location.reload()
    }, 1000)
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

// Funcion para actualizar un usuario
async function updateUser() {
    // Data to be added to the database
    const sendData = {
        id: userUpd.id,
        // 
        pres_img: formActualizar.imagen.value,
        pres_correo: formActualizar.correo.value,
        pres_domicilio: formActualizar.domicilio.value,
        pres_nombre: formActualizar.name.value,
        pres_telefono: formActualizar.telefono.value
    }
    await updateUsuario(sendData)
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

// Funcion para renovar prestamo
async function renewBook() {
    // Data to be added to the database
    const sendData = {
        id: librosRen.id,
        // 
        pres_fecha_fin: formRen.fechaFin.value,
        pres_fecha_inicio: formRen.fechaInicio.value
    }
    await updatePrestamo(sendData)
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
  
   // Para deshabilitar los botones de las acciones por si un campo esta vacio
  formApa.addEventListener('input', () => {
    const inputs = formApa.querySelectorAll('input');
    let isFormValid = true;
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        isFormValid = false;
      }
    });
    btnUp.disabled = !isFormValid;
  });

  formActualizar.addEventListener('input', () => {
    const inputs = formActualizar.querySelectorAll('input');
    let isFormValid = true;
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        isFormValid = false;
      }
    });
    btnAct.disabled = !isFormValid;
  });

  formRen.addEventListener('input', () => {
    const inputs = formRen.querySelectorAll('input');
    let isFormValid = true;
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        isFormValid = false;
      }
    });
    btnRen.disabled = !isFormValid;
  });


  form.addEventListener('input', () => { 
    const inputs = form.querySelectorAll('input'); 
    let isFormValid = true; 
    inputs.forEach((input) => {
        if (!input.value) {
        isFormValid = false;
        } 
    }); 
    if (isFormValid) {
        addButton.removeAttribute('disabled'); 
    } else {
        addButton.setAttribute('disabled', 'disabled');
    } 
});
  



//--------------------LOGOUT----------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signOut} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const logout = document.getElementById('btnLogout')// Selects the button to logout


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT1L4DJjQAHciOmgUbNccepE0DyDvoStE",
  authDomain: "authentication-users-a2ae0.firebaseapp.com",
  databaseURL: "https://authentication-users-a2ae0-default-rtdb.firebaseio.com",
  projectId: "authentication-users-a2ae0",
  storageBucket: "authentication-users-a2ae0.appspot.com",
  messagingSenderId: "688812296811",
  appId: "1:688812296811:web:62fdf4febedbbc5284bf2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


logout.addEventListener('click', (e) =>{
    signOut(auth).then(() => {
        // Sign-out successful.
        //alert('LogOut successfully')
        window.location.href = "./"; 
    }).catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        //alert(errorMessage);
        alert('Error al cerrar sesión', errorMessage);
    });
})



