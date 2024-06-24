import auth from './firebase.js';
import { 
    GoogleAuthProvider, 
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const googleLoginButton = document.getElementById('googleLoginButton');

googleLoginButton.addEventListener('click', () => {
    console.log('Google Sign-In button clicked');
    const provider = new GoogleAuthProvider();
    console.log('GoogleAuthProvider instantiated');
  
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Sign-in successful');
        const user = result.user;
        console.log('User signed in: ', user);
      })
      .catch((error) => {
        console.error('Error during sign in: ', error);
      });
  });
