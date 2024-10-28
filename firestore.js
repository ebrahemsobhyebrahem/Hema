// firestore.js
import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

export async function addMessage(messageContent) {
    try {
        await addDoc(collection(db, "messages"), {
            content: messageContent,
            timestamp: new Date()
        });
        console.log("Message added successfully");
    } catch (error) {
        console.error("Error adding message: ", error);
    }
}

export async function fetchMessages() {
    const messagesSnapshot = await getDocs(collection(db, "messages"));
    return messagesSnapshot.docs.map(doc => doc.data());
}
