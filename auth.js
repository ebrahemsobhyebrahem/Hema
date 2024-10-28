// auth.js
import { auth, db } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;

            // تخزين بيانات المستخدم في Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email,
                profile_picture: user.photoURL
            });

            console.log("User data saved successfully!");

            // إخفاء زر تسجيل الدخول وإظهار حالة تسجيل الدخول
            document.querySelector('.signin-button').style.display = 'none';
            const loginStatus = document.querySelector('.login-status');
            loginStatus.innerHTML = `Logged in as ${user.displayName}`;
            loginStatus.style.display = 'block';
        })
        .catch((error) => {
            console.error("Error during sign in: ", error);
        });
}
