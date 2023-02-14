import firebase from "firebase/compat/app";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  FieldValue,
  getCountFromServer,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
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
export const db = getFirestore(app);

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
  let usersData = {};
  getDoc(userDocRef).then((userDoc) => {
    const followingUsers = userDoc.data().following;
    followingUsers.forEach((followingUser) => {
      getUserData(followingUser).then((user) => {
        usersData = user;
      });
      const followingUserQuery = query(
        usersCollectionRef,
        where("uid", "==", followingUser)
      );
      getDocs(followingUserQuery).then((followingUserDocs) => {
        followingUserDocs.forEach((followingUserDoc) => {
          let followingUserPosts = followingUserDoc.data().userPosts;
          followingUserPosts.forEach((postId) => {
            getPost(postId, usersData, (post) => {
              posts.push(post);
              if (
                postId === followingUserPosts[followingUserPosts.length - 1]
              ) {
                console.log(posts);
                callback(posts);
                usersData = {};
              }
            });
          });
        });
      });
    });
  });
};

//   // Create a reference to the "posts" collection in the database
//   const postsCollectionRef = collection(db, "posts");

//   // Create a reference to the document with id "userId" in the "users" collection
//   const userDocRef = doc(db, "users", userId);

//   // Create a reference to the "users" collection in the database
//   const usersCollectionRef = collection(db, "users");

//   // Create an empty array to store posts
//   let posts = [];

//   // Create an object to store a single post
//   let post = {};

//   // Create an object to store the data of the users
//   let usersData = {};

//   // Get the document with id "userId" from the "users" collection
//   getDoc(userDocRef).then((userDoc) => {
//     // Get the list of users that the current user is following
//     const followingUsers = userDoc.data().following;

//     // Loop through each following user
//     followingUsers.forEach((followingUser) => {
//       // Get the data of the following user
//       getUserData(followingUser).then((user) => {
//         // Store the data of the following user
//         usersData = user;
//       });

//       // Create a query to get the document of the following user from the "users" collection
//       const followingUserQuery = query(
//         usersCollectionRef,
//         where("uid", "==", followingUser)
//       );

//       // Get the document of the following user from the "users" collection
//       getDocs(followingUserQuery).then((followingUserDocs) => {
//         // Loop through each document of the following user
//         followingUserDocs.forEach((followingUserDoc) => {
//           // Get the list of posts by the following user
//           let followingUserPosts = followingUserDoc.data().userPosts;

//           // Loop through each post by the following user
//           followingUserPosts.forEach((postId) => {
//             // Create a reference to the post with id "postId" in the "posts" collection
//             const postDocRef = doc(db, "posts", postId);
//             let PID = postId;

//             // Create a reference to the "comments" sub-collection of the post with id "postId"
//             const postCommentsCollectionRef = collection(
//               db,
//               "posts",
//               postId,
//               "comments"
//             );

//             // Get the data of the post with id "postId"
//             getDoc(postDocRef).then((postDoc) => {
//               // Store the data of the post
//               post = postDoc.data();

//               // Initialize the "comments" field for the post
//               post.comments = {};

//               // Store the data of the creator of the post
//               post.creator = usersData;

//               // Store the id of the post
//               post.id = PID;
//             });

//             getDocs(postCommentsCollectionRef).then((postCommentDocs) => {
//               //Iterate over each comment document in the collection
//               let commentCounter = 0;
//               postCommentDocs.forEach((postCommentDoc) => {
//                 //Add the comment data to the post object using the commentCounter as the key
//                 post.comments[commentCounter] = postCommentDoc.data();
//                 commentCounter++;
//               });
//               //Push the post object to the posts array
//               posts.push(post);
//               //Reset the post object
//               post = {};

//               //Check if this is the last post from the current following user
//             });
//             if (postId === followingUserPosts[followingUserPosts.length - 1]) {
//               //Log the posts array
//               console.log(posts);
//               //Call the callback function with the posts array as the argument
//               callback(posts);
//               //Reset the usersData object
//               usersData = {};
//             }
//           });
//         });
//       });
//     });
//   });
// };

export const getPost = (postId, user, callback) => {
  // Create an object to store a single post
  let post = {};
  //get creator data
  let usersData = {};
  if (user) {
    usersData = user;
  }

  // Create a reference to the post with id "postId" in the "posts" collection
  const postDocRef = doc(db, "posts", postId);
  let PID = postId;

  // Create a reference to the "comments" sub-collection of the post with id "postId"
  const postCommentsCollectionRef = collection(db, "posts", postId, "comments");
  const commentsQuery = query(
    postCommentsCollectionRef,
    orderBy("createdAt"),
    limit(1)
  );

  // Get the data of the post with id "postId"
  getDoc(postDocRef).then((postDoc) => {
    // Store the data of the post
    post = postDoc.data();
    getCountFromServer(postCommentsCollectionRef).then((number) => {
      console.log(number.data().count);
      post.commentsLength = number.data().count;

      // Initialize the "comments" field for the post
      post.comments = {};

      // Store the id of the post
      post.id = PID;

      // Store the data of the creator of the post
      if (user) {
        post.creator = usersData;
        getDocs(postCommentsCollectionRef).then((postCommentDocs) => {
          //Iterate over each comment document in the collection
          let commentCounter = 0;
          postCommentDocs.forEach((postCommentDoc) => {
            //Add the comment data to the comment object using the commentCounter as the key
            post.comments[commentCounter] = postCommentDoc.data();
            commentCounter++;
          });
          callback(post);
        });
      } else {
        getUserData(post.user).then((postCreator) => {
          post.creator = postCreator;
          getDocs(commentsQuery).then((postCommentDocs) => {
            //Iterate over each comment document in the collection
            let commentCounter = 0;
            postCommentDocs.forEach((postCommentDoc) => {
              //Add the comment data to the post object using the commentCounter as the key
              post.comments[commentCounter] = postCommentDoc.data();
              commentCounter++;
              // post.commentsLength =
            });
            callback(post);
          });
        });
      }
    });
  });
};

export const sendComment = async (
  postId,
  comment,
  user,
  userName,
  userPhoto
) => {
  // const postRef = doc(db, "posts", postId);

  // // Wait for the post to be retrieved before adding the comment
  // await getPost(postId, false);

  const commentsRef = collection(db, "posts", postId, "comments");

  // Wait for the comment to be added before returning the result
  const result = await addDoc(commentsRef, {
    author: user,
    author_name: userName,
    author_photo: userPhoto,
    text: comment,
    createdAt: serverTimestamp(),
  });

  return result;
};

export const getComments = (postId) => {
  const postCommentsCollectionRef = collection(db, "posts", postId, "comments");
  const commentsQuery = query(
    postCommentsCollectionRef,
    orderBy("createdAt", "desc"),
    limit(25)
  );
  getDocs(commentsQuery).then((postDoc) => {
    postDoc.forEach((post) => {
      // console.log(post.data());
    });
  });
};

// const commentsQuery = query(
//   postCommentsCollectionRef,
//   orderBy("createdAt"),
//   limit(25)
// );

export default app;
