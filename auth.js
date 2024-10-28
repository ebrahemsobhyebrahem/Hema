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
        // إعادة تعيين حالة الواجهة بعد تسجيل الخروج
        updateUI(null);
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// تحديث حالة الواجهة بناءً على حالة تسجيل الدخول
function updateUI(user) {
    const loginButtonContainer = document.getElementById('login-button-container');
    const userInfo = document.getElementById('user-info');
    const userPhoto = document.getElementById('user-photo');
    const loginStatus = document.getElementById('login-status');

    if (user) {
        // إخفاء زر تسجيل الدخول، إظهار معلومات المستخدم، وتحديث صورة المستخدم
        loginButtonContainer.style.display = 'none';
        userInfo.style.display = 'flex';
        userPhoto.src = user.photoURL;
        loginStatus.style.display = 'block';
        loginStatus.innerText = 'You are logged in!';
        
        // حفظ بيانات المستخدم في Firestore
        setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL
        }, { merge: true }).then(() => {
            console.log("User data saved successfully!");
        }).catch((error) => {
            console.error("Error saving user data: ", error);
        });
    } else {
        // إعادة عرض زر تسجيل الدخول وإخفاء معلومات المستخدم
        loginButtonContainer.style.display = 'block';
        userInfo.style.display = 'none';
        loginStatus.style.display = 'none';
    }
}

// مراقبة حالة تسجيل الدخول عند تحميل الصفحة
onAuthStateChanged(auth, (user) => {
    updateUI(user);
});

// تصدير دوال تسجيل الدخول وتسجيل الخروج
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
