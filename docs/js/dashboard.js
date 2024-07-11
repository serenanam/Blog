import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import db from './firebase.js';
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();

const emailField = document.querySelector('.email');
const pwField = document.querySelector('.pw');

const signUpBtn = document.querySelector('.sign-up-btn');
const signInBtn = document.querySelector('.sign-in-btn');

const dashboardField = document.querySelector('.dashboard');
const loginField = document.querySelector('.sign-in');

const blogSection = document.querySelector('.blogs-section');

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

      getUserWrittenBlogs(user.email);
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

//fetch user written blogs

const getUserWrittenBlogs = (userEmail) => {
  getDocs(query(collection(db, 'blogs'), where('author', '==', userEmail.split('@')[0])))
  .then((blogs) => {
    blogs.forEach((blog) => {
      createBlog(blog);
    })
  })
  .catch((error) => {
    console.log("error getting blogs");
    console.log(error);
  })
}

const deleteBlog = (id) => {
  deleteDoc(doc(db, "blogs", id)).then(() => {
    location.reload();
  })
  .catch((error) => {
    console.log("error deleting the blog");
  })
}

const createBlog = (blog) => {
  let data = blog.data();
  blogSection.innerHTML += 
  `<div class="blog-card">
      <img src="${data.bannerImage}" class="blog-image" alt="">
      <h1 class="blog-title">${data.title.substring(0, 100) + '...'} </h1>
      <p class="blog-overview"> ${data.article.substring(0, 50) + '...'} </p>
      <a href="/${blog.id}.html" class="btn dark"> read </a>
      <a href="/${blog.id}.html" class="btn grey"> edit </a>
      <a href="#" class="btn grey delete-btn" > delete </a>

  </div>`;

  let deleteBtn = document.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (event) => {
    event.preventDefault();
    deleteBlog(blog.id);
  });

  // <a href="#" onclick="deleteBlog('${blog.id}')" class="btn grey delete-btn"> delete </a>

}

