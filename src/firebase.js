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
  increment,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, doc, setDoc, getDoc, addDoc } from "firebase/firestore";
import { store } from "./redux/store";
import {
  setUser,
  setPhotoURL,
  setUsername,
  setDisplayName,
} from "./redux/userSlice";
import { ref, deleteObject } from "firebase/storage";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { setConversation } from "./redux/conversationsSlice";
import { setPost } from "./redux/postsSlice";

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
const user = auth.currentUser;

export const storage = getStorage(app);

//--------------------FOR USERS--------------------
export const signInWithGoogle = async (callback) => {
  const provider = new GoogleAuthProvider();
  const currentUserDetails = {
    message:
      "Thank you for testing my Instagram Clone platform. I hope you enjoy using it and please feel free to share any feedback or suggestions you may have. If you have any questions, you can contact me directly via Github (https://github.com/Albertoflj) or LinkedIn (https://www.linkedin.com/in/abagiualberto/).",
    userId: "QahgWcwga4edVwhtJUBsqmDTMlQ2",
    username: "alberto",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/social-media-app-133db.appspot.com/o/images%2F1668339088910.jpg4cf04219-9598-4434-a9e1-dedfd8baed6f?alt=media&token=9c4343d4-aada-41f6-aa04-98dbe1c06043",
  };

  // check if user is already signed in
  if (localStorage.getItem("signedInWithGoogle") === "true") {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);

      getDoc(userRef).then((doc) => {
        if (!doc.exists()) {
          const chatId =
            "QahgWcwga4edVwhtJUBsqmDTMlQ2" < user.uid
              ? "QahgWcwga4edVwhtJUBsqmDTMlQ2" + user.uid
              : user.uid + "QahgWcwga4edVwhtJUBsqmDTMlQ2";

          setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            bio: "Hi! I'm new here.",
            followers: [],
            following: [user.uid],
            username:
              user.displayName.replace(/\s/g, "").toLowerCase() +
              Math.floor(Math.random() * 1000),
            userPosts: [],
            conversations: [],
          });
          createChat(user.uid, "QahgWcwga4edVwhtJUBsqmDTMlQ2", chatId);

          addChatMessage(chatId, currentUserDetails);
          store.dispatch(setUsername(user.uid));
          store.dispatch(setDisplayName(user.displayName));
          store.dispatch(setPhotoURL(user.photoURL));
          followUser("QahgWcwga4edVwhtJUBsqmDTMlQ2");
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
        const chatId =
          "QahgWcwga4edVwhtJUBsqmDTMlQ2" < user.uid
            ? "QahgWcwga4edVwhtJUBsqmDTMlQ2" + user.uid
            : user.uid + "QahgWcwga4edVwhtJUBsqmDTMlQ2";
        getDoc(userRef).then((doc) => {
          if (!doc.exists()) {
            setDoc(userRef, {
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
              uid: result.user.uid,
              bio: "Hi! I'm new here.",
              followers: [],
              following: [result.user.uid],
              username:
                result.user.displayName.replace(/\s/g, "").toLowerCase() +
                Math.floor(Math.random() * 1000),
              userPosts: [],
              conversations: [],
            });

            createChat(user.uid, "QahgWcwga4edVwhtJUBsqmDTMlQ2", chatId);
            addChatMessage(chatId, currentUserDetails);
            store.dispatch(setUser(user.uid));
            store.dispatch(setPhotoURL(user.photoURL));
            followUser("QahgWcwga4edVwhtJUBsqmDTMlQ2");
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

export const checkIfUserHasUsername = async (uid) => {
  const userRef = doc(db, "users", uid);
  const hasUsername = await getDoc(userRef).then((res) => {
    if (res.data().username != null) {
      return true;
    } else {
      return false;
    }
  });
};
export const writeUsername = async (username) => {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      username: username,
    });
  } catch (error) {
    console.error("Error updating username:", error);
  }
};

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document does not exist.");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
  }
};

//--------------------FOR POSTS--------------------

export const getFollowingPosts = async (userId, callback) => {
  try {
    signInWithGoogle(() => {
      const postsCollectionRef = collection(db, "posts");
      const userDocRef = doc(db, "users", userId);
      const usersCollectionRef = collection(db, "users");

      let posts = [];
      let post = {};
      let usersData = {};

      //get posts id, put in redux, fetch 3 by 3 posts from ids by user scrolling
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
                  store.dispatch(setPost(JSON.parse(JSON.stringify(posts))));
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error getting following posts:", error);
  }
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
          store.dispatch(setPost(JSON.parse(JSON.stringify(posts))));
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
              // post.commentsLength = commentCounter;
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
  try {
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
    const postRef = doc(db, "posts", postId);
    updateDoc(postRef, {
      commentsLength: increment(1),
    });

    return result;
  } catch (error) {
    console.error("Could not send comment:", error);
  }
};

export const getComments = (postId) => {
  try {
    const postCommentsCollectionRef = collection(
      db,
      "posts",
      postId,
      "comments"
    );
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
  } catch (error) {
    console.log("Could not get comments: ", error);
  }
};

export const sendLike = async (userId, postId) => {
  try {
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
  } catch (error) {
    console.log("Could not send like: ", error);
  }
};

// const commentsQuery = query(
//   postCommentsCollectionRef,
//   orderBy("createdAt"),
//   limit(25)
// );

export const createPost = async (post) => {
  try {
    const postCollectionRef = collection(db, "posts");
    const result = await addDoc(postCollectionRef, {
      caption: post.caption,
      user: post.user,
      photo: post.image,
      photoLocation: post.imageLocation,
      likedBy: [],
      createdAt: serverTimestamp(),
      commentsLength: 0,
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
  } catch (error) {
    console.log("Could not create post: ", error);
  }
};

export const editProfile = async (name, bio) => {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const result = await updateDoc(userRef, {
      displayName: name,
      bio: bio,
    });
    return result;
  } catch (error) {
    console.log("Could not edit profile: ", error);
  }
};

export const unfollowUser = async (userId) => {
  try {
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

    return [result, result2];
  } catch (error) {
    console.log("Could not unfollow user: ", error);
  }
};

export const followUser = async (userId) => {
  try {
    const user = auth.currentUser;

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

    const chatId = userId < user.uid ? userId + user.uid : user.uid + userId;

    //check if chat already exists, if not, create new chat
    const chatRef = doc(db, "chats", chatId);
    const chatResult = await getDoc(chatRef).then((chat) => {
      if (!chat.exists()) {
        createChat(userId, user.uid, chatId);
      }
    });

    return [result, result2, chatResult];
  } catch (error) {
    console.log("Could not follow user: ", error);
  }
};

export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    //delete image from storage
    const result3 = await getDoc(postRef).then((res) => {
      const photo = res.data().photoLocation;
      const storageRef = ref(storage, photo);
      deleteObject(storageRef);
    });

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

    return [result, result2, result3];
  } catch (error) {
    console.log("Could not delete post: ", error);
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    const result = await deleteDoc(commentRef);
    return result;
  } catch (error) {
    console.log("Could not delete comment: ", error);
  }
};

export const searchUsers = async (searchTerm) => {
  try {
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
  } catch (error) {
    console.log("Could not search users: ", error);
  }
};

export const getFollowingChats = async (userId, secondUserId) => {
  try {
    const firstId = userId;
    const secondId = secondUserId;
    const chatId = firstId < secondId ? firstId + secondId : secondId + firstId;

    // check if chat exists
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      // console.log(chatDoc.data());
      const chat = chatDoc.data();
      chat.id = chatId;
      return chat;
    } else {
      console.log("Chat does not exist");
      const secondUser = await getUserData(secondId);
      const firstUser = await getUserData(firstId);
      await setDoc(doc(db, "chats", chatId), {
        user1: {
          photoURL: firstUser.photoURL,
          username: firstUser.username,
          userId: firstId,
        },
        user2: {
          photoURL: secondUser.photoURL,
          username: secondUser.username,
          userId: secondId,
        },

        lastMessage: "",
        lastMessageSent: new Date(),
      });
      addUserConversation(firstId, chatId);
      addUserConversation(secondId, chatId);
      return chatId;
    }
  } catch (error) {
    console.log("Could not get following chats: ", error);
  }
};
export const createChat = async (firstId, secondId, chatId) => {
  try {
    const secondUser = await getUserData(secondId);
    const firstUser = await getUserData(firstId);
    await setDoc(doc(db, "chats", chatId), {
      user1: {
        photoURL: firstUser.photoURL,
        username: firstUser.username,
        userId: firstId,
      },
      user2: {
        photoURL: secondUser.photoURL,
        username: secondUser.username,
        userId: secondId,
      },
      lastMessage: "",
      lastMessageSent: new Date(),
      timeCreated: serverTimestamp(),
    });
    addUserConversation(firstId, chatId);
    addUserConversation(secondId, chatId);
    return chatId;
  } catch (error) {
    console.log("Could not create chat: ", error);
  }
};

export const addUserConversation = async (userId, chatId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const conversations = userDoc.data().conversations;
      conversations.push(chatId);
      await updateDoc(userRef, {
        conversations: conversations,
      });
    } else {
      console.log("User does not exist");
    }
  } catch (error) {
    console.log("Could not add user conversation: ", error);
  }
};
export const getUserConversations = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const conversations = userDoc.data().conversations;
      const conversationUsers = [];
      for (let i = 0; i < conversations.length; i++) {
        const chatRef = doc(db, "chats", conversations[i]);
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
          const chat = chatDoc.data();
          chat.id = conversations[i];
          conversationUsers.push(chat);
          store.dispatch(
            setConversation(JSON.parse(JSON.stringify(conversationUsers)))
          );
        }
      }
      return conversationUsers;
    } else {
      console.log("User does not exist");
      return [];
    }
  } catch (error) {
    console.log("Could not get user conversations: ", error);
  }
};

export const getFollowingUsers = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const following = userDoc.data().following;
      const followingUsers = [];
      for (let i = 0; i < following.length; i++) {
        const userRef = doc(db, "users", following[i]);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          followingUsers.push(userDoc.data());
        }
      }
      return followingUsers;
    } else {
      console.log("User does not exist");
      return [];
    }
  } catch (error) {
    console.log("Could not get following users: ", error);
  }
};

export const getConversationMessages = async (chatId) => {
  try {
    const messagesRef = collection(
      db,
      "conversationMessages",
      chatId,
      "messages"
    );
    const messagesQuery = query(messagesRef, orderBy("timeSent"));
    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return messages;
  } catch (error) {
    console.log("Could not get conversation messages: ", error);
  }
};

export const addChatMessage = async (chatId, senderDetails) => {
  try {
    const messagesRef = collection(
      db,
      "conversationMessages",
      chatId,
      "messages"
    );
    const result = await addDoc(messagesRef, {
      // message: "yessirrr",
      message: senderDetails.message,
      timeSent: new Date(),
      sender: senderDetails.userId,
      name: senderDetails.username,
      photoURL: senderDetails.photoURL,
    });
    //add last message to chat
    const chatRef = doc(db, "chats", chatId);
    const result2 = await updateDoc(chatRef, {
      lastMessage: senderDetails.message,
      lastMessageSent: new Date(),
    });

    return [result, result2];
  } catch (error) {
    console.log("Could not add chat message: ", error);
  }
};

export default app;
