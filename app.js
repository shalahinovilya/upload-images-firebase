import {initializeApp} from "firebase/app";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {uploadImg} from "./upload.js";

const firebaseConfig = {
    apiKey: "AIzaSyAjH1ni6y9QVKdsZPCHeNpVvDOyRmfQ-V4",
    authDomain: "upload-images-d6c52.firebaseapp.com",
    projectId: "upload-images-d6c52",
    storageBucket: "upload-images-d6c52.appspot.com",
    messagingSenderId: "1029423049014",
    appId: "1:1029423049014:web:b52c9a254853a84498eb97",
    measurementId: "G-CH32Z93JPB"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app)


uploadImg({
    onUpload (images, infoBlocks) {
        Object.keys(images).forEach((img, index) => {

            const imgType = images[img].type.split('/')[1]

            const storageRef = ref(storage, `/images/${img}.${imgType}`)
            const uploadTask = uploadBytesResumable(storageRef, images[img]);

            uploadTask.on('state_changed',
                (snapshot) => {

                    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';

                    const progressBar = infoBlocks[index].querySelector('.info-bar__progress-bar')

                    progressBar.style.width = progress
                    progressBar.textContent = progress

                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log('error', error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            );
        })
    }
})