import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyA47KsnIIfm_nkhrf_IXnH8xrFvPxjcHRE",
    authDomain: "dropbox-clone-42854.firebaseapp.com",
    projectId: "dropbox-clone-42854",
    storageBucket: "dropbox-clone-42854.firebasestorage.app",
    messagingSenderId: "924826487634",
    appId: "1:924826487634:web:762549212a28520d81c88b"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };