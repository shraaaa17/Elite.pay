import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";


// ----------------------
// Firebase config
// ----------------------
const firebaseConfig = {
  apiKey: "AIzaSyDLmfjUZwh-sykvvStFt4JP7WJCl9wiiYQ",
  authDomain: "elite-pay-3ef1a.firebaseapp.com",
  projectId: "elite-pay-3ef1a",
  storageBucket: "elite-pay-3ef1a.firebasestorage.app",
  messagingSenderId: "560681484378",
  appId: "1:560681484378:web:c0996e12137bc36cab9863",
};


// ----------------------
// Initialize
// ----------------------
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



// ---------------------------------------------------------------
// 1) SIGNUP (Automatically logs in user)
// ---------------------------------------------------------------
export async function signupUser(email, password, username) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
      paymentId: "", // future support
    });

    return { success: true, user: userCred.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}



// ---------------------------------------------------------------
// 2) LOGIN
// ---------------------------------------------------------------
export async function loginUser(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCred.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}



// ---------------------------------------------------------------
// 3) LOGOUT
// ---------------------------------------------------------------
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}



// ===================================================================
// 4) PRODUCT CRUD
// ===================================================================

// ADD PRODUCT
export async function addProduct(userId, productData) {
  return await addDoc(collection(db, "products"), {
    userId,
    ...productData,
    createdAt: serverTimestamp(),
  });
}

// GET PRODUCTS (for logged-in user)
export async function getUserProducts(userId) {
  const q = query(collection(db, "products"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// UPDATE PRODUCT
export async function updateProduct(productId, newData) {
  return await updateDoc(doc(db, "products", productId), newData);
}

// DELETE PRODUCT
export async function deleteProduct(productId) {
  return await deleteDoc(doc(db, "products", productId));
}



// ===================================================================
// 5) USER PAYMENT ID (Add / Update / Get)
// ===================================================================
export async function updateUserPaymentId(userId, paymentId) {
  return await updateDoc(doc(db, "users", userId), {
    paymentId,
  });
}

export async function getUserPaymentId(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data().paymentId : "";
}



// ===================================================================
// 6) CREATE TRANSACTION  (Clean + Bug-fixed version)
// ===================================================================
export async function createTransaction(userId, amount, receiverIdentifier, note) {
  try {
    if (!amount || Number(amount) <= 0) {
      return { success: false, error: "Invalid amount" };
    }

    // Check receiver exists
    const usersRef = collection(db, "users");
    const q1 = query(usersRef, where("email", "==", receiverIdentifier));
    const q2 = query(usersRef, where("username", "==", receiverIdentifier));

    const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    let receiverDoc = null;

    if (!s1.empty) receiverDoc = s1.docs[0];
    else if (!s2.empty) receiverDoc = s2.docs[0];

    if (!receiverDoc) {
      return { success: false, error: "Receiver not found" };
    }

    // SUCCESS TRANSACTION
    const tx = {
      userId,
      receiver: receiverIdentifier,
      amount: Number(amount),
      note: note || "",
      status: "SUCCESS",
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "transactions"), tx);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}



// ===================================================================
// 7) TRANSACTION HISTORY REAL-TIME LISTENER
// ===================================================================
export function listenToUserTransactions(userId, callback) {
  const q = query(collection(db, "transactions"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}