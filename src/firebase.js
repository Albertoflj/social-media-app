import firebase from "firebase/compat/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { collection, doc, setDoc, getDoc, addDoc } from "firebase/firestore";

import { useCollectionData } from "react-firebase-hooks/firestore";

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
export const auth = getAuth(app);
const db = getFirestore(app);

export const signInWithGoogle = async (callback) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const userRef = doc(db, "users", result.user.uid);

      getDoc(userRef).then((docs) => {
        if (!docs.data()) {
          setDoc(userRef, {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
            bio: "Hi! I'm new here.",
            followers: [],
            following: ["QahgWcwga4edVwhtJUBsqmDTMlQ2"],
            username: null,
          });
        }
        getDoc(userRef).then((res) => {
          callback(res.data().username);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signOut = () => {
  auth.signOut();
};

export const checkIfUsernameExists = async (username) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const data = await getDocs(q);
  let usernameExists = false;
  data.forEach((doc) => {
    if (doc) {
      usernameExists = true;
      return;
    }
  });
  return usernameExists;
};

export const checkIfUserHasUsername = (uid) => {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((res) => {
    if (res.data().username != null) {
      return true;
    } else {
      return false;
    }
  });
};
export const writeUsername = async (username) => {
  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
    username: username,
  });
};

export const getUserData = async (uid) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
};

export default app;
