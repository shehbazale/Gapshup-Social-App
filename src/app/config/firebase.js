import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBfF4nbsNe35GXmxqb_EC3BbiGFDDSe9pI",
  authDomain: "north-store-react.firebaseapp.com",
  projectId: "north-store-react",
  storageBucket: "north-store-react.appspot.com",
  messagingSenderId: "28281892407",
  appId: "1:28281892407:web:59d20f95048ab8d391d9b2",
  measurementId: "G-BLP89BKSEQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

// *********************************  Register Function ***********************
async function register(data) {
  const { fullname, age, email, password } = data;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const userId = userCredential.user.uid;

  return setDoc(doc(db, "users", userId), { fullname, age, email });
}

// ********************************** Login Function ***********************************
function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

//  **************************  Signin with Google *********************************
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.log("login errror", error);
  }
};

//  ****************************** Add post function *********************************
async function addPost(postData) {
  const { post, image } = postData;
  const userId = auth.currentUser?.uid;

  const storageRef = ref(storage, "products/" + image.name);
  await uploadBytes(storageRef, image);
  const url = await getDownloadURL(storageRef);

  return addDoc(collection(db, "posts"), {
    post,
    image: url,
    userId: userId,
    timestamp: serverTimestamp(),
  });
}
//  ********************************** Get post function *******************************

const getPosts = (callback) => {
  const q = query(collection(db, "posts"));

  const result = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        posts.push(data);
      });
      console.log("Real-time posts data => ", posts);
      callback(posts);
    },
    (error) => {
      console.log("Error fetching posts => ", error);
    }
  );

  return result;
};

//****************************************** */ Get user by id function ********************
const getUserById = async (userId) => {
  try {
    // console.log("Received user ID:", userId);
    const docRef = doc(db, "users", userId);
    // console.log("Document reference:", docRef);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // console.log(" User data:", data);
      return data;
    } else {
      console.log("No User found ");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// ************************************************** Show friend suggestion****************************

const fetchSuggestions = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("No user logged in");
        return resolve([]);
      }

      try {
        const currentUserId = user.uid;
        const usersCollection = collection(db, "users");

        const querySnapshot = await getDocs(usersCollection);
        const users = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentUserId) {
            users.push({ id: doc.id, ...doc.data() });
          }
        });

        const friendRequestsSnapshot = await getDocs(
          query(
            collection(db, "friendRequests"),
            where("senderId", "==", currentUserId)
          )
        );

        const pendingRequests = new Set();
        const acceptedFriends = new Set();

        friendRequestsSnapshot.docs.forEach((doc) => {
          const request = doc.data();
          if (request.status === "pending") {
            pendingRequests.add(request.recipientId);
          } else if (request.status === "accepted") {
            acceptedFriends.add(request.recipientId);
          }
        });

        console.log("Pending Requests:", pendingRequests);
        console.log("Accepted Friends:", acceptedFriends);

        const filteredUsers = users.filter(
          (user) =>
            !pendingRequests.has(user.id) && !acceptedFriends.has(user.id)
        );

        resolve(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        resolve([]);
      }
    });
  });
};

// **************************************** Friend Request function***********************

export const sendFriendRequest = async (recipientId) => {
  const currentUserId = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid);
      } else {
        console.error("No user logged in");
        resolve(null);
      }
    });
  });

  if (!currentUserId) return;

  try {
    const friendRequestRef = doc(
      collection(db, "friendRequests"),
      `${currentUserId}_${recipientId}`
    );
    await setDoc(friendRequestRef, {
      senderId: currentUserId,
      recipientId,
      status: "pending",
    });
    console.log("Friend request sent");
  } catch (error) {
    console.error("Failed to send friend request:", error);
  }
};

// ***************************************** Fetch friend request fucntion ************************

const fetchFriendRequests = (onUpdate) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.error("No user logged in");
      onUpdate([]);
      return;
    }

    const currentUserId = user.uid;
    const friendRequestsCollection = collection(db, "friendRequests");

    const q = query(
      friendRequestsCollection,
      where("recipientId", "==", currentUserId),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const friendRequests = await Promise.all(
        snapshot.docs.map(async (requestDoc) => {
          const requestData = requestDoc.data();
          const senderDoc = await getDoc(
            doc(db, "users", requestData.senderId)
          );
          const senderName = senderDoc.exists()
            ? senderDoc.data().fullname
            : "Unknown User";

          return {
            id: requestDoc.id,
            senderId: requestData.senderId,
            recipientId: requestData.recipientId,
            status: requestData.status,
            senderName,
            time: requestData.time,
          };
        })
      );

      onUpdate(friendRequests);
    });

    return unsubscribe;
  });
};

const acceptFriendRequest = async (friendRequestId, senderId, recipientId) => {
  try {
    const friendRequestRef = doc(db, "friendRequests", friendRequestId);
    await updateDoc(friendRequestRef, { status: "accepted" });

    const senderRef = doc(db, "users", senderId);
    const recipientRef = doc(db, "users", recipientId);

    await updateDoc(senderRef, {
      friends: arrayUnion(recipientId),
    });

    await updateDoc(recipientRef, {
      friends: arrayUnion(senderId),
    });

    console.log(
      "Friend request accepted and users added to each other's friend list"
    );
  } catch (error) {
    console.error("Failed to accept friend request:", error);
  }
};

//  ***************************** function to Cancel Request ***************************
const handleCancel = async (friendRequestId, deleteRequest = false) => {
  try {
    const friendRequestRef = doc(db, "friendRequests", friendRequestId);

    if (deleteRequest) {
      await deleteDoc(friendRequestRef);
      console.log("Friend request deleted");
    } else {
      await updateDoc(friendRequestRef, { status: "cancelled" });
      console.log("Friend request cancelled");
    }

    return true;
  } catch (error) {
    console.error("Error cancelling friend request", error);
    return false;
  }
};

// ****************************  function to fetch Friend list *******************

const fetchAcceptedFriends = (callback) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return;
  }

  const currentUserId = user.uid;

  const friendRequestsRef = collection(db, "friendRequests");
  const q = query(
    friendRequestsRef,
    where("recipientId", "==", currentUserId),
    where("status", "==", "accepted")
  );

  // Set up a listener
  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const friendsList = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const requestData = docSnap.data();
        const senderDoc = await getDoc(doc(db, "users", requestData.senderId));
        return {
          id: requestData.senderId,
          name: senderDoc.exists() ? senderDoc.data().fullname : "User",
        };
      })
    );
    callback(friendsList);
  });

  return unsubscribe;
};

//  ********************************** Chat Functions *********************************

//*******************************   */ Send message function  ********************
const sendMessage = async (senderId, receiverId, message) => {
  try {
    await addDoc(collection(db, "messages"), {
      senderId,
      receiverId,
      message,
      timestamp: serverTimestamp(),
    });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message", error);
  }
};

//******************************* * Listen for new messages function  ************
const listenForMessages = (userId1, userId2, callback) => {
  const q = query(
    collection(db, "messages"),
    where("senderId", "in", [userId1, userId2]),
    where("receiverId", "in", [userId1, userId2]),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({ id: doc.id, ...data });
    });
    callback(messages);
  });

  return unsubscribe;
};

export {
  register,
  login,
  auth,
  collection,
  onAuthStateChanged,
  addPost,
  getDocs,
  db,
  doc,
  getDoc,
  getPosts,
  signOut,
  signInWithGoogle,
  getUserById,
  fetchSuggestions,
  fetchFriendRequests,
  acceptFriendRequest,
  handleCancel,
  fetchAcceptedFriends,
  sendMessage,
  listenForMessages,
};
