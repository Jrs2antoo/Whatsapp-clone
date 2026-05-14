import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDbme39HKlmooSGzIfMwFPkWy8-UpCwbFQ",
    authDomain: "whatsapp-clone-80c42.firebaseapp.com",
    projectId: "whatsapp-clone-80c42",
    storageBucket: "whatsapp-clone-80c42.firebasestorage.app",
    messagingSenderId: "836967806874",
    appId: "1:836967806874:web:9421aa4d71a7bc54cfac23",
    measurementId: "G-W2HPKBHYEF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

