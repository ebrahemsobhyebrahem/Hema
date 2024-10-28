// auth.js
import { auth, db } from './firebaseConfig.js';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
}

// دالة تسجيل الخروج
function signOutUser() {
    signOut(auth).then(() => {
        // إظهار زر تسجيل الدخول وإخفاء معلومات المستخدم بعد تسجيل الخروج
        document.getElementById('login-button-container').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// تحقق من حالة تسجيل الدخول عند تحميل الصفحة
onAuthStateChanged(auth, async (user) => {
    const loginButtonContainer = document.getElementById('login-button-container');
    const userInfo = document.getElementById('user-info');
    const userPhoto = document.getElementById('user-photo');

    if (user) {
        // إخفاء زر تسجيل الدخول وإظهار معلومات المستخدم
        loginButtonContainer.style.display = 'none';
        userInfo.style.display = 'flex';

        // تعيين صورة المستخدم
        userPhoto.src = user.photoURL;

        // تخزين بيانات المستخدم إذا لم تكن موجودة بالفعل
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL
        }, { merge: true });

        console.log("User is logged in and data is saved.");
    } else {
        // إظهار زر تسجيل الدخول وإخفاء معلومات المستخدم إذا لم يكن المستخدم مسجل الدخول
        loginButtonContainer.style.display = 'block';
        userInfo.style.display = 'none';
    }
});

// جعل دالة تسجيل الدخول وتسجيل الخروج متاحة في النطاق العام
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
