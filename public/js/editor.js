import db from './firebase.js';
import {
    collection,
    addDoc,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
        alert("upload a banner image to publish this post");
    }

    if(articleField.value.length && blogTitleField.value.length) {
        //generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        //setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        //access firestore with db variable;
        setDoc(doc(collection(db, "blogs"), docName), {
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()-1]} ${date.getFullYear()}`
        })
        .then(() => {
            // console.log("date entered");
            location.href = `/${docName}`;
         
        })
        .catch((err) => {
            console.error(err);
        })
    }
})