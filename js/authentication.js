// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const signUp = document.querySelector('.signUp') // Selects the button to signup
const login = document.querySelector('.login') // Selects the button to login
//const logout = document.querySelector('.logout') // Selects the button to logout


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
const database = getDatabase(app);
const auth = getAuth();

const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const modalRegistro = document.querySelector('.modalRegistro');
const modalLogin = document.querySelector('.modalLogin');

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    modalRegistro.style.display = 'block';
    modalLogin.style.display = 'none';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    modalRegistro.style.display = 'none';
    modalLogin.style.display = 'block';
});


signUp.addEventListener('click', (e) => {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var username = document.getElementById('username').value;

    if (!email=='' && !password=='' && !username=='')
    {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            //Guarda los usuarios en la realtime-database
            set(ref(database, 'users/' + user.uid),{
                username: username,
                email: email
            })
            Swal.fire({
                icon: 'success',
                title: 'Te has registrado correctamente!!!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = "index.html"; // Redirige al usuario a biblioteca.html
            });
            //alert('user created!');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //alert(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los datos estan incompletos!!'
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hay campos vacíos'
        });
    }
});

login.addEventListener('click', (e) => {
    var email = document.getElementById('email_l').value;
    var password = document.getElementById('password_l').value;

    if (!email=='' && !password=='')
    {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            const dt = new Date();
            update(ref(database, 'users/' + user.uid),{
                last_login: dt,
            })
            //alert('User loged in!')
            window.location.href = "biblioteca.html"; // Redirige al usuario a biblioteca.html
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //alert(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los datos son erróneos!!'
            });
        });
    } else {
        //alert('Hay campos vacios');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hay campos vacíos'
        });
    }
});

//logout
/*const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});

logout.addEventListener('click', (e) =>{
    signOut(auth).then(() => {
        // Sign-out successful.
        alert('LogOut successfully')
    }).catch((error) => {
        // An error happened.
        const errorCode = error.code;
            const errorMessage = error.message;
            //alert(errorMessage);
            alert('Error al cerrar sesión');
    });
})*/
