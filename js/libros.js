import {  getLibros } from './firebase_connection.js' // Imports the querys

const Buscar = document.getElementById('inBuscador') 
const resultsContainer = document.querySelector('.results')


const imgStephen = document.getElementById('imgStephen') 
const imgClaire = document.getElementById('imgClaire') 
const imgJohn = document.getElementById('imgJohn') 
const imgNail = document.getElementById('imgNail') 
const imgPerfume = document.getElementById('imgPerfume') 

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
        fragment.appendChild(clone)
    })
    contenido.appendChild(fragment)
}

function main() {


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
  

        let librosFiltrados = []
        librosFiltrados = libros.filter((libro) => libro.lib_categoria === categoriaSeleccionada)
        creaCards(librosFiltrados)

  
      const menuCheckbox = document.getElementById('btn-menu')
      menuCheckbox.checked = false; // Cierra el menú al hacer clic en una categoría
    })
  })
  
   
//IMAGENES DEL INICIO
imgStephen.addEventListener('click', () => {
    let temp = []
    temp = libros.filter((libro) => libro.lib_autor == 'Stephen King')
    creaCards(temp)
 });

 imgClaire.addEventListener('click', () => {
    let temp = []
    temp = libros.filter((libro) => libro.lib_autor == 'Claire Martin')
    creaCards(temp)
 });

 imgJohn.addEventListener('click', () => {
    let temp = []
    temp = libros.filter((libro) => libro.lib_autor == 'John Green')
    creaCards(temp)
 });

 imgNail.addEventListener('click', () => {
    let temp = []
    temp = libros.filter((libro) => libro.lib_autor == 'Neil Gaiman')
    creaCards(temp)
 });

 imgPerfume.addEventListener('click', () => {
    let temp = []
    temp = libros.filter((libro) => libro.lib_titulo == 'El perfume del rey')
    creaCards(temp)
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



