import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDhmJHd03azTwvdHVbRqM0xunVBQjFnAs0",
    authDomain: "sleepyslothrecords831.firebaseapp.com",
    projectId: "sleepyslothrecords831",
    storageBucket: "sleepyslothrecords831.appspot.com",
    messagingSenderId: "661338350896",
    appId: "1:661338350896:web:4a1d88bdac11d05a0254f5",
    measurementId: "G-62HBJ1Z5HC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default {db, auth};