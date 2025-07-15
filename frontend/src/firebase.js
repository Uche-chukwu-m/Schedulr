import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use

    // Your web app's Firebase configuration
    apiKey: "AIzaSyCNj2CbPj9S8zU3suN3ix_vDgjLxDMJ1qw",
    authDomain: "oval-machine-413804.firebaseapp.com",
    projectId: "oval-machine-413804",
    storageBucket: "oval-machine-413804.firebasestorage.app",
    messagingSenderId: "441198036447",
    appId: "1:441198036447:web:be871509fb3af1fb11b06a",
    measurementId: "G-NCCY4T6M7X"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
// const analytics = getAnalytics(app);