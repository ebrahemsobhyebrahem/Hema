// auth.js
import { auth, db } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithRedirect } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

window.signInWithGoogle = function() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
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
            document.getElementById('login-button-container').style.display = 'none';
            document.getElementById('login-status').style.display = 'block';
        })
        .catch((error) => {
            console.error("Error during sign in: ", error);
        });
};
