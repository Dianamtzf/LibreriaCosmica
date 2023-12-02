// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";


const signUp = document.querySelector('.signUp') // Selects the button to signup
const login = document.querySelector('.login') // Selects the button to login
const loginGoog = document.querySelector('.loginGoog') //Selects the button ton login with Google
//const logout = document.querySelector('btnCerrarSesion') // Selects the button to logout


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
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

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
                text: 'Error al registrarse. Vuelva a intentarlo.'
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

loginGoog.addEventListener('click', (e) => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        Swal.fire({
            icon: 'success',
            text: '¡Bienvenido/a!',
            title: user.displayName,
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            window.location.href = "biblioteca.html"; // Redirige al usuario a biblioteca.html
        });

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salio mal!!'
        });
    });
});


//logout
const user = auth.currentUser;
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
/*
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


const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupButton = document.getElementById('signup_button');

// Función para verificar si todos los campos de entrada están completos
function checkInputs() {
    const usernameValue = usernameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (usernameValue !== '' && emailValue !== '' && passwordValue !== '') {
        signupButton.disabled = false;
    } else {
        signupButton.disabled = true;
    }
}

// Agregar eventos de cambio a los campos de entrada
usernameInput.addEventListener('input', checkInputs);
emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);


const emailLoginInput = document.getElementById('email_l');
const passwordLoginInput = document.getElementById('password_l');
const loginButton = document.querySelector('.login');

// Función para verificar si los campos de entrada están completos
function checkLoginInputs() {
    const emailLoginValue = emailLoginInput.value.trim();
    const passwordLoginValue = passwordLoginInput.value.trim();

    if (emailLoginValue !== '' && passwordLoginValue !== '') {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

// Agregar eventos de cambio a los campos de entrada
emailLoginInput.addEventListener('input', checkLoginInputs);
passwordLoginInput.addEventListener('input', checkLoginInputs);

