import logo from "./logo.svg";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./main-styles/main.scss";
import MainPage from "./pages/main-page/MainPage";

const provider = new GoogleAuthProvider();
const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

export const firestore = firebase.firestore();

export const auth = getAuth(app);

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("lol");
    })

    .catch((error) => {
      console.log(error);
    });
};

export const signOut = () => {
  auth.signOut();
};

function App() {
  const [user] = useAuthState(auth);
  return (
    <HashRouter>
      <div className="App">
        {/* {user ? (
        <button
          type="button"
          data-testid="signOut"
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </button>
      ) : (
        <button
          type="button"
          data-testid="signInWithGoogle"
          onClick={() => {
            signInWithGoogle();
          }}
        >
          Sign in with Google
        </button>
      )} */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/messages" element={<MainPage />} />
          <Route path="/myprofile" element={<MainPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
