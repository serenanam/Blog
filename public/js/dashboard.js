import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

const emailField = document.querySelector('.email');
const pwField = document.querySelector('.pw');

const signUpBtn = document.querySelector('.sign-up-btn');
const signInBtn = document.querySelector('.sign-in-btn');

const dashboardField = document.querySelector('.dashboard');
const loginField = document.querySelector('.sign-in');


const login = () => {
  signUpBtn.addEventListener('click', () => {
    if(emailField.value.length && pwField.value.length) {
      createUserWithEmailAndPassword(auth, emailField.value, pwField.value).then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      alert("account successfully created.");
      // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("can't sign up user");
      // ..
      });
    } else {console.log("fjeiajf")}
  })
  
  signInBtn.addEventListener('click', () => {
    if(emailField.value.length && pwField.value.length) {
      signInWithEmailAndPassword(auth, emailField.value, pwField.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        console.log("signed in");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    }
  })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
      // Show the dashboard if user is authenticated
      if (dashboardField) {
          dashboardField.style.display = 'block';
      }

      if(loginField) {
        loginField.style.display = 'none';
      }
  } else {

      login();
      // Hide the dashboard if user is not authenticated
      if (dashboardField) {
        dashboardField.style.display = 'none';
      }

      if(loginField) {
        loginField.style.display = 'block';
      }

  }
});


