// Import the functions you need from the SDKs you need
import {initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCms6O-u5tO319yqXjLSeKNcBmHj1IKWKw",
  authDomain: "inventory-managements-b00c6.firebaseapp.com",
  projectId: "inventory-managements-b00c6",
  storageBucket: "inventory-managements-b00c6.appspot.com",
  messagingSenderId: "492219386023",
  appId: "1:492219386023:web:b489249e688256b9367382",
  measurementId: "G-GE2CBHBD2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); 

export {firestore};