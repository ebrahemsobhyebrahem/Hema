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
        document.getElementById('login-button-container').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// تحقق من حالة تسجيل الدخول
onAuthStateChanged(auth, async (user) => {
    const loginButtonContainer = document.getElementById('login-button-container');
    const userInfo = document.getElementById('user-info');
    const userPhoto = document.getElementById('user-photo');

    if (user) {
        loginButtonContainer.style.display = 'none';
        userInfo.style.display = 'flex';

        // تعيين صورة المستخدم
        userPhoto.src = user.photoURL || 'default-profile.png';

        // حفظ بيانات المستخدم في Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            profile_picture: user.photoURL
        }, { merge: true });
    } else {
        loginButtonContainer.style.display = 'block';
        userInfo.style.display = 'none';
    }
});

// دوال تسجيل الدخول وتسجيل الخروج يمكن الوصول لها من النطاق العام
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
