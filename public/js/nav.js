import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let ul = document.querySelector('.links-container');
const auth = getAuth();

const logoutUser = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        location.reload();

      }).catch((error) => {
        // An error happened.
      });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
      ul.innerHTML += `
      <li class="link-item"> <a href="/admin" class="btnNav"> dashboard </a> </li>
      <li class="link-item"> <a href="#" id="logout-link" onclick="logoutUser()" class="btnNav"> logout </a> </li>
      `
      document.getElementById('logout-link').addEventListener('click', (event) => {
        event.preventDefault();
        logoutUser();
    });
  
    } else {
      // User is signed out
      // ...
  
      ul.innerHTML += `
      <li class="link-item"> <a href="/admin" class="btnNav"> login </a> </li>

      `
    }
  });