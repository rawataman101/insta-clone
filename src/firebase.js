import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNcmwLBGFTK3Dy2U6DiFW6HE0GSO19yTA",
  authDomain: "instagram-clone-cdfc9.firebaseapp.com",
  projectId: "instagram-clone-cdfc9",
  storageBucket: "instagram-clone-cdfc9.appspot.com",
  messagingSenderId: "652675177728",
  appId: "1:652675177728:web:e56353440629c6f68da7e5",
  measurementId: "G-Q4RT0SMHGT",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
