// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js"


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkvANTM80FD-Ls1jnSELUfXnlTfT-1RLk",
  authDomain: "libraryghandi.firebaseapp.com",
  projectId: "libraryghandi",
  storageBucket: "libraryghandi.appspot.com",
  messagingSenderId: "904884929770",
  appId: "1:904884929770:web:c1db98723a3c44edff4393"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore()
const libros = collection(database, "libros")

// #################### RUTAS LIBROS #####################
// Define the routes using the corresponding HTTP methods
// GET
const getLibros = async () => {
    const array = await getDocs(libros)
    try {
        let returnData = []
        array.forEach(libro => {
            const libroData = libro.data()
            const libroId = libro.id
            const libroWithId = { ...libroData, id: libroId }
            returnData.push(libroWithId)
        })
        return returnData
    } catch (err) {
        console.error("Error! Couldn't get the elements from the database:", err)
    }
}

// POST
const saveLibro = async (sendData) => {
    try{
        addDoc(libros, sendData)
        console.log("Book saved successfully:", sendData.libro_titulo)
    } catch(err){
        console.error("Error! Couldn't save the Book:", err)
    }
}

// DELETE
const deleteLibro = async (lib) => {
    try {
        await deleteDoc(doc(libros, lib.id));
        console.log("Libro deleted: ", lib.libro_titulo);
    } catch (error) {
        console.error("Error! Couldn't delete the book: ", error);
    }
  }

  // UPDATE hacerlo manualmente en el conexion
  const updateLibro = async (lib) => {
    try {
      console.log('@@@',lib.id)
      const libroRef = doc(libros, lib.id);
      await updateDoc(libroRef, {
        lib_disponibilidad: lib.lib_disponibilidad,
        pres_correo: lib.pres_correo,
        pres_domicilio: lib.pres_domicilio,
        pres_fecha_fin: lib.pres_fecha_fin,
        pres_fecha_inicio: lib.pres_fecha_inicio,
        pres_nombre: lib.pres_nombre,
        pres_telefono: lib.pres_telefono
      });
      console.log("Libro actualizado correctamente:", lib.libro_titulo);
    } catch (error) {
      console.error("¡Error! No se pudo actualizar el libro:", error);
    }
  }
  
  

export { getLibros, saveLibro, deleteLibro, updateLibro }