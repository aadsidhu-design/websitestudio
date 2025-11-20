import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBrWQNGMBaU5goVOa4wswKcL8G8LIoi_Po",
    authDomain: "robin-studio-62d2d.firebaseapp.com",
    projectId: "robin-studio-62d2d",
    storageBucket: "robin-studio-62d2d.firebasestorage.app",
    messagingSenderId: "510379101633",
    appId: "1:510379101633:web:6b1ccc0bce8b8d4b86b340",
    measurementId: "G-QTFYN8FDLT"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { auth, googleProvider, analytics };
