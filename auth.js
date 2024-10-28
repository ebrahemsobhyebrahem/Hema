// auth.js
import { auth, db } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
}

// تحقق من حالة تسجيل الدخول عند تحميل الصفحة
onAuthStateChanged(auth, async (user) => {
    const loginButtonContainer = document.getElementById('login-button-container');
    const loginStatus = document.getElementById('login-status');

    if (user) {
        // إخفاء زر تسجيل الدخول وإظهار رسالة تسجيل الدخول
        loginButtonContainer.style.display = 'none';
        loginStatus.style.display = 'block';
        loginStatus.innerText = 'You are logged in!'; // إضافة رسالة "تم تسجيل الدخول"

        // تخزين بيانات المستخدم إذا لم تكن موجودة بالفعل
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL
        }, { merge: true });

        console.log("User is logged in and data is saved.");
    } else {
        // إظهار زر تسجيل الدخول وإخفاء الرسالة إذا لم يكن المستخدم مسجل الدخول
        loginButtonContainer.style.display = 'block';
        loginStatus.style.display = 'none';
    }
});

// جعل دالة تسجيل الدخول متاحة في النطاق العام
window.signInWithGoogle = signInWithGoogle;
