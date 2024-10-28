// auth.js
import { auth, db } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
}

// مراقبة حالة تسجيل الدخول عند تحميل الصفحة
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // إخفاء زر تسجيل الدخول وإظهار حالة تسجيل الدخول
        document.getElementById('login-button-container').style.display = 'none';
        document.getElementById('login-status').style.display = 'block';

        // تخزين بيانات المستخدم في Firestore إذا لم تكن موجودة
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL
        }, { merge: true });

        console.log("User is logged in and data is saved.");
    } else {
        // إظهار زر تسجيل الدخول إذا لم يكن المستخدم مسجلًا للدخول
        document.getElementById('login-button-container').style.display = 'block';
        document.getElementById('login-status').style.display = 'none';
    }
});

// جعل الدالة متاحة في النطاق العام
window.signInWithGoogle = signInWithGoogle;
