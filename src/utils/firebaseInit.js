import { initializeApp } from "firebase/app";
const config = {
    apiKey: "AIzaSyAfG0-KTgqhaqhRpia7Nwk2TbN3rjW9iSI",
    authDomain: "mytodolist-7790d.firebaseapp.com",
    databaseURL:
        "https://mytodolist-7790d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mytodolist-7790d",
    storageBucket: "mytodolist-7790d.appspot.com",
    messagingSenderId: "14567298168",
    appId: "1:14567298168:web:c13dc1468ae415b863898d",
    measurementId: "G-QKS1YTRR5V",
};
const app = initializeApp(config);

export default app;
