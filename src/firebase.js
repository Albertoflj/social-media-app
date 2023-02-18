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
  deleteDoc,
  startAt,
  endAt,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
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

export const storage = getStorage(app);

//--------------------FOR USERS--------------------
export const signInWithGoogle = async (callback) => {
  const provider = new GoogleAuthProvider();

  // check if user is already signed in
  if (localStorage.getItem("signedInWithGoogle") === "true") {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);

      getDoc(userRef).then((doc) => {
        if (!doc.exists()) {
          setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            bio: "Hi! I'm new here.",
            followers: [],
            following: [user.uid, "QahgWcwga4edVwhtJUBsqmDTMlQ2"],
            username:
              user.displayName.replace(/\s/g, "") +
              Math.floor(Math.random() * 1000),
            userPosts: [],
          });
        }
        callback(user.uid);
      });
    } else {
      // user is not signed in
      localStorage.removeItem("signedInWithGoogle");
      signInWithGoogle(callback);
    }
  } else {
    // user is not signed in
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("signedInWithGoogle", "true");
        const userRef = doc(db, "users", result.user.uid);

        getDoc(userRef).then((doc) => {
          if (!doc.exists()) {
            setDoc(userRef, {
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
              uid: result.user.uid,
              bio: "Hi! I'm new here.",
              followers: [],
              following: [result.user.uid, "QahgWcwga4edVwhtJUBsqmDTMlQ2"],
              username:
                result.user.displayName.replace(/\s/g, "").toLowerCase() +
                Math.floor(Math.random() * 1000),
              userPosts: [],
            });
          }
          callback(result.user.uid);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
export const signOut = () => {
  auth.signOut();
  localStorage.removeItem("signedInWithGoogle");
};
export const checkIfUserIsSignedIn = () => {
  const user = auth.currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
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

export const getFollowingPosts = async (userId, callback) => {
  signInWithGoogle(() => {
    const postsCollectionRef = collection(db, "posts");
    const userDocRef = doc(db, "users", userId);
    const usersCollectionRef = collection(db, "users");

    let posts = [];
    let post = {};
    let usersData = {};

    getDoc(userDocRef).then(async (userDoc) => {
      const followingUsers = userDoc.data().following;
      const userDataPromises = followingUsers.map((followingUser) => {
        return getUserData(followingUser);
      });
      const userDataList = await Promise.all(userDataPromises);
      usersData = Object.assign({}, ...userDataList);
      followingUsers.forEach((followingUser) => {
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
                  callback(posts);
                }
              });
            });
          });
        });
      });
    });
  });
};
export const getAllPostsFromSpecificUser = async (userId, callback) => {
  const postsCollectionRef = collection(db, "posts");
  const userDocRef = doc(db, "users", userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userPosts = userDoc.data().userPosts;
      const userData = await getUserData(userId);
      let posts = [];
      userPosts.forEach((postId) => {
        getPost(postId, userData, (post) => {
          posts.push(post);
          if (postId === userPosts[userPosts.length - 1]) {
            callback(posts);
          }
        });
      });
    } else {
      console.log(`User ${userId} not found`);
      callback([]);
    }
  } catch (error) {
    console.log(`Error getting user ${userId}: ${error}`);
    callback([]);
  }
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

export const getPost = (postId, usersData, callback) => {
  // Create an object to store a single post
  let post = {};

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
      if (post) {
        // Store the id of the post
        post.id = PID;

        // Store the data of the creator of the post
        if (usersData && usersData[post.user]) {
          post.creator = usersData[post.user];
          getDocs(postCommentsCollectionRef).then((postCommentDocs) => {
            //Iterate over each comment document in the collection
            let commentCounter = 0;
            post.comments = {};
            postCommentDocs.forEach((postCommentDoc) => {
              //Add the comment data to the comment object using the commentCounter as the key
              post.comments[commentCounter] = postCommentDoc.data();
              commentCounter++;
            });
            post.commentsLength = commentCounter;
            callback(post);
          });
        } else {
          getUserData(post.user).then((postCreator) => {
            post.creator = postCreator;
            getDocs(commentsQuery).then((postCommentDocs) => {
              //Iterate over each comment document in the collection
              let commentCounter = 0;
              post.comments = {};
              postCommentDocs.forEach((postCommentDoc) => {
                //Add the comment data to the post object using the commentCounter as the key
                post.comments[commentCounter] = postCommentDoc.data();
                commentCounter++;
              });
              post.commentsLength = commentCounter;
              callback(post);
            });
          });
        }
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

export const sendLike = async (userId, postId) => {
  const likesRef = doc(db, "posts", postId);

  // Wait for the comment to be added before returning the result

  const result = await getDoc(likesRef).then((res) => {
    let likes = res.data().likedBy;
    if (likes.includes(userId)) {
      const index = likes.indexOf(userId);
      likes.splice(index, 1);
      updateDoc(likesRef, {
        likedBy: likes,
      });
    } else {
      likes.push(userId);
      updateDoc(likesRef, {
        likedBy: likes,
      });
    }
  });
};

// const commentsQuery = query(
//   postCommentsCollectionRef,
//   orderBy("createdAt"),
//   limit(25)
// );

export const createPost = async (post) => {
  const postCollectionRef = collection(db, "posts");
  const result = await addDoc(postCollectionRef, {
    caption: post.caption,
    user: post.user,
    photo: post.image,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
  const userRef = doc(db, "users", auth.currentUser.uid);
  getUserData(auth.currentUser.uid).then((user) => {
    const userPosts = user.userPosts;
    userPosts.push(result.id);
    updateDoc(userRef, {
      userPosts: userPosts,
    });
  });

  return result;
};

export const editProfile = async (name, bio) => {
  const userRef = doc(db, "users", auth.currentUser.uid);
  const result = await updateDoc(userRef, {
    displayName: name,
    bio: bio,
  });
  return result;
};

export const unfollowUser = async (userId) => {
  const userRef = doc(db, "users", auth.currentUser.uid);
  const result = await getDoc(userRef).then((res) => {
    let following = res.data().following;
    const index = following.indexOf(userId);
    following.splice(index, 1);
    updateDoc(userRef, {
      following: following,
    });
  });
  // remove user from followers list
  const userRef2 = doc(db, "users", userId);
  const result2 = await getDoc(userRef2).then((res) => {
    let followers = res.data().followers;
    const index = followers.indexOf(auth.currentUser.uid);
    followers.splice(index, 1);
    updateDoc(userRef2, {
      followers: followers,
    });
  });

  return result, result2;
};

export const followUser = async (userId) => {
  const userRef = doc(db, "users", auth.currentUser.uid);
  const result = await getDoc(userRef).then((res) => {
    let following = res.data().following;
    following.push(userId);
    updateDoc(userRef, {
      following: following,
    });
  });
  // add user to followers list
  const userRef2 = doc(db, "users", userId);
  const result2 = await getDoc(userRef2).then((res) => {
    let followers = res.data().followers;
    followers.push(auth.currentUser.uid);
    updateDoc(userRef2, {
      followers: followers,
    });
  });

  return result, result2;
};

export const deletePost = async (postId) => {
  const postRef = doc(db, "posts", postId);
  const result = await deleteDoc(postRef);
  // remove post from user's posts list
  const userRef = doc(db, "users", auth.currentUser.uid);
  const result2 = await getDoc(userRef).then((res) => {
    let userPosts = res.data().userPosts;
    const index = userPosts.indexOf(postId);
    userPosts.splice(index, 1);
    updateDoc(userRef, {
      userPosts: userPosts,
    });
  });

  return result;
};

export const deleteComment = async (postId, commentId) => {
  const commentRef = doc(db, "posts", postId, "comments", commentId);
  const result = await deleteDoc(commentRef);
  return result;
};

export const searchUsers = async (searchTerm) => {
  const usersRef = collection(db, "users");
  const usersQuery = query(
    usersRef,
    orderBy("username"),
    startAt(searchTerm),
    endAt(searchTerm + "\uf8ff"),
    limit(5)
  );
  const querySnapshot = await getDocs(usersQuery);
  const users = [];
  querySnapshot.forEach((doc) => {
    if (doc.data().username.startsWith(searchTerm)) {
      users.push({ id: doc.id, ...doc.data() });
    }
  });
  return users;
};

export default app;
