// auth.js
import { auth, db } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
}

function signOutUser() {
    signOut(auth).then(() => {
        displayLoginUI();
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}

function displayLoginUI() {
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
}

function displayUserUI(user) {
    document.getElementById('login-button').style.display = 'none';
    const userInfo = document.getElementById('user-info');
    userInfo.style.display = 'flex';
    document.getElementById('user-photo').src = user.photoURL;
}

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        displayUserUI(user);
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL
        }, { merge: true });
        console.log("User is logged in and data saved.");
    } else {
        displayLoginUI();
    }
});

// Make functions available globally
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
