// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVL9viWyCpl1wXk2iUdZw273lgEPj8vbg",
    authDomain: "mathadventure-3b421.firebaseapp.com",
    databaseURL: "https://mathadventure-3b421-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mathadventure-3b421",
    storageBucket: "mathadventure-3b421.firebasestorage.app",
    messagingSenderId: "615635494747",
    appId: "1:615635494747:web:bf738412dec69feb5bdc7e",
    measurementId: "G-DLCCMLPDPZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const nicknameInput = document.getElementById('nickname');
const passwordInput = document.getElementById('password');
const greeting = document.getElementById('greeting');
const currentScore = document.getElementById('current-score');
const newScoreInput = document.getElementById('new-score');

// Login
document.getElementById('login').addEventListener('click', async () => {
    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value;
    const email = `${nickname}@mathadventure.com`;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
    } catch (error) {
        console.error('Error signing in:', error.message);
        alert(error.message);
    }
});

// Load Profile
onAuthStateChanged(auth, async (user) => {
    if (user) {
        authSection.style.display = 'none';
        profileSection.style.display = 'block';

        const userDoc = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            const data = userSnap.data();
            greeting.textContent = `How is it going, ${data.nickname}?`;
            currentScore.textContent = data.currentScore || 0;
        } else {
            console.error('No user data found');
        }
    } else {
        authSection.style.display = 'block';
        profileSection.style.display = 'none';
    }
});

// Update Score
document.getElementById('update-score').addEventListener('click', async () => {
    const newScore = parseInt(newScoreInput.value);

    if (!isNaN(newScore)) {
        const user = auth.currentUser;
        const userDoc = doc(db, 'Users', user.uid);

        await updateDoc(userDoc, { currentScore: newScore });
        currentScore.textContent = newScore;
        alert('Score updated successfully!');
    } else {
        alert('Please enter a valid score.');
    }
});

// Logout
document.getElementById('logout').addEventListener('click', async () => {
    await signOut(auth);
    alert('Logged out successfully!');
});
