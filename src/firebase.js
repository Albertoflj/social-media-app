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

//--------------------FOR USERS--------------------
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

//--------------------FOR POSTS--------------------

//post object

// let post = {
//   user: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
//   caption: "This is a test post",
//   photoURL: "https://picsum.photos/200",
//   likes: [],
//   comments: {
//     0: {
//       author: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
//       comment: "This is a test comment",
//     },
//   },
// };

export const getFollowingPosts = async (userId, callback) => {
  const postsCollectionRef = collection(db, "posts");
  const userDocRef = doc(db, "users", userId);
  const usersCollectionRef = collection(db, "users");

  let posts = [];
  let post = {};
  // get the document of the user with the provided userId
  getDoc(userDocRef).then((userDoc) => {
    const followingUsers = userDoc.data().following;
    followingUsers.forEach((followingUser) => {
      // get all the users that the current user is following
      const followingUserQuery = query(
        usersCollectionRef,
        where("uid", "==", followingUser)
      );
      getDocs(followingUserQuery).then((followingUserDocs) => {
        followingUserDocs.forEach((followingUserDoc) => {
          let followingUserPosts = followingUserDoc.data().userPosts;
          followingUserPosts.forEach((postId) => {
            const postDocRef = doc(db, "posts", postId);
            const postCommentsCollectionRef = collection(
              db,
              "posts",
              postId,
              "comments"
            );

            // get the document of the post with the postId
            getDoc(postDocRef).then((postDoc) => {
              // console.log(postDoc.data());
              post = postDoc.data();
              post.comments = {};
            });

            // get all the comments of the post with the postId
            getDocs(postCommentsCollectionRef).then((postCommentDocs) => {
              let commentCounter = 0;
              postCommentDocs.forEach((postCommentDoc) => {
                post.comments[commentCounter] = postCommentDoc.data();
                commentCounter++;
              });
              posts.push(post);
              post = {};

              if (
                postId === followingUserPosts[followingUserPosts.length - 1]
              ) {
                console.log(posts);
                callback(posts);
              }
            });
          });
        });
      });
    });
  });
};

// const q = query(followingPostsRef, where("username", "==", username));

export default app;
