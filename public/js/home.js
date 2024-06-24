import db from './firebase.js';
import {
    collection,
    getDocs,
    doc,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const blogSection = document.querySelector('.blogs-section');


getDocs(query(collection(db, "blogs"), orderBy("publishedAt", "asc"))).then((blogs) => {
    blogs.forEach(blog => {
        if(blog.id != decodeURI(location.pathname.split("/").pop())) {
            createBlog(blog);
        }
    })
})

const createBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += 
    `<div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'} </h1>
        <p class="blog-overview"> ${data.article.substring(0, 50) + '...'} </p>
        <a href="/${blog.id}" class="btn dark"> read </a>
    </div>`;
}