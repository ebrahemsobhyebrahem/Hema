// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSKD85CvBegxmTB85U53cfMzARY4bT15Q",
    authDomain: "chathema-731a9.firebaseapp.com",
    projectId: "chathema-731a9",
    storageBucket: "chathema-731a9.appspot.com",
    messagingSenderId: "342396420343",
    appId: "1:342396420343:web:345d1de98cfd4ea78ad3f2",
    measurementId: "G-DZ2WKLJK5L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
