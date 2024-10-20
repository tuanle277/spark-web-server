// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, setLogLevel } from 'firebase/firestore';
import { getStorage } from "firebase/storage"; // For file storage
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAKWOysbYyP6umZZB96qFHVNsxugQ7CaAA",
    authDomain: "hackwashu-70a1a.firebaseapp.com",
    projectId: "hackwashu-70a1a",
    storageBucket: "hackwashu-70a1a.appspot.com",
    messagingSenderId: "364961898194",
    appId: "1:364961898194:web:a66f9dce3d6a32162b170b",
    measurementId: "G-3PQZSQKJVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
const auth = getAuth(app);

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in: ", user);
    } else {
        console.log("No user is signed in");
    }
});

const storage = getStorage(app);
export { db, storage, auth };

setLogLevel('debug');