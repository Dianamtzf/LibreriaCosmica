import {  getLibros, saveLibro, deleteLibro, updateLibro } from './firebase_connection.js' // Imports the querys

const form = document.querySelector(".formApartar") // Selects the form
const btnAdd = document.querySelector('.btnAdd') // Selects the button to add books
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


const main = () => {

    // Aquí van las llamadas a las demás funciones y listeners
    creaCards(libros)
    btnAdd.addEventListener('click', e => {
        e.preventDefault(); // Evita que se refresque la página
        updateBook()
    })

    //Función para buscar por nombre de libro o de autor
 Buscar.addEventListener('keyup', () => {
    console.log('Si llega aquí');
    let temp = libros.filter(book =>
        book && book.lib_titulo && book.lib_autor &&
        (book.lib_titulo.toLowerCase().includes(Buscar.value.toLowerCase()) ||
        book.lib_autor.toLowerCase().includes(Buscar.value.toLowerCase()))
    );
    creaCards(temp);
});


}
// ---------------- Funciones ------------------

// Funcion para añadir un libro
const updateBook = async () => {
    // Data to be added to the database
    const sendData = {
        //lib_disponibilidad: true,
        pres_correo: form.correo.value,
        pres_domicilio: form.domicilio.value,
        pres_fecha_fin: form.fechaFin.value,
        pres_fecha_inicio: form.fechaInicio.value,
        pres_nombre: form.name.value,
        pres_telefono: form.telefono.value
    }
    await updateLibro(sendData)
    form.reset()
}



//Evento click en las categorías del menú lateral
document.querySelectorAll('.container-menu nav a').forEach((categoria) => {
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
  
      const menuCheckbox = document.getElementById('btn-menu');
      menuCheckbox.checked = false; // Cierra el menú al hacer clic en una categoría
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

  


