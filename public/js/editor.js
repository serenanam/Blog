import db from './firebase.js';
import {
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

//banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image") {
                addImage(data, file.name);
            } else {
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else {
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"];

publishBtn.addEventListener('click', () => {
    if(!bannerPath) {
        alert("upload a banner image to publish this post"); //NOTE: Banner will not show up properly if the name of the file has spaces. should fix in the future
    }

    if(articleField.value.length && blogTitleField.value.length) {
        let docName;
        if(blogID[0] == 'editor') {
            //generating id
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = '';
            for(let i = 0; i < 4; i++) {
                id += letters[Math.floor(Math.random() * letters.length)];
            }
            //setting up docName
            docName = `${blogTitle}-${id}`;
        } else {
            docName = decodeURI(blogID[0]);
        }
        
        let date = new Date(); // for published at info

        //checking for user log in status
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //access firestore with db variable;
                setDoc(doc(collection(db, "blogs"), docName), {
                    title: blogTitleField.value,
                    article: articleField.value,
                    bannerImage: bannerPath,
                    publishedAt: `${date.getDate()} ${months[date.getMonth()-1]} ${date.getFullYear()}`,
                    author: user.email.split('@')[0]
                })
                .then(() => {
                    // console.log("date entered");
                    location.href = `/${docName}`;
                
                })
                .catch((err) => {
                    console.error(err);
                })
            } else {
                location.replace("/admin");
            }
        });
    }
})

//checking for user log in status
onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.replace("/admin");
    }
});

//checking for user log in status
onAuthStateChanged(auth, (user) => {
    if (user) {
        //access firestore with db variable;
        setDoc(doc(collection(db, "blogs"), docName), {
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()-1]} ${date.getFullYear()}`,
            author: user.email.split('@')[0]
        })
        .then(() => {
            // console.log("date entered");
            location.href = `/${docName}`;
        
        })
        .catch((err) => {
            console.error(err);
        })
    } else {
        location.replace("/admin");
    }
});

//checking for existing blog edits
let blogID = location.pathname.split("/");
blogID.shift();
if(blogID[0] != "editor") {
    //that means the page exists
    let docRef = doc(db, "blogs", decodeURI(blogID[0]));
    getDoc(docRef).then((doc) => {
        // console.log(doc.data());
        if(doc.exists) {
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleField.value = data.article;
        } else {
            location.replace("/");
        }
    })
}