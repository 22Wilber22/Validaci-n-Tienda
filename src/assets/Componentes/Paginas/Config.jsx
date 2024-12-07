// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMSXaDD7I40dGq9t4PCN2J7umPehLuUpo",
  authDomain: "bd-tienda-a37e2.firebaseapp.com",
  projectId: "bd-tienda-a37e2",
  storageBucket: "bd-tienda-a37e2.firebasestorage.app",
  messagingSenderId: "412012426643",
  appId: "1:412012426643:web:f96f54d6f989ca0e7b6466"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//creamos la constante para poder autenticar
const auth_user = getAuth(app);
const db = getFirestore(app)
export { auth_user, db };
