import logo from "./logo.svg";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./main-styles/main.scss";
import MainPage from "./pages/main-page/MainPage";
import { getUserData } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUsername, setFinishedFetching } from "./redux/userSlice";
import Post from "./components/Posts/Post";

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
export const auth = getAuth(app);

function App() {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const username = useSelector((state) => state.user.username);
  if (user) {
    getUserData(user.uid).then((data) => {
      if (data && data.username) {
        dispatch(setUsername(data.username));
      }
      dispatch(setFinishedFetching(true));
    });
  } else {
    dispatch(setFinishedFetching(true));
  }
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
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/messages" element={<MainPage />} />
          <Route exact path="/myprofile" element={<MainPage />} />
          <Route exact path="/post/:postid" element={<Post />} />
          <Route exact path="/user/:userid" element={<MainPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
