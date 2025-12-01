import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

// -------- UNIFIED FIRESTORE IMPORT --------
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";


// ----------------------
// Your Firebase config
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

// ----------------------
// Signup
// ----------------------
export async function signupUser(email, password, username) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Save user doc with email and username (keyed by uid)
    await setDoc(doc(db, "users", userCred.user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
      // optional fields: balance: 0
    });

    return { success: true, user: userCred.user };
  } catch (error) {
    let msg = "Signup failed";
    if (error.code === "auth/email-already-in-use") msg = "Email already registered";
    if (error.code === "auth/invalid-email") msg = "Invalid email format";
    if (error.code === "auth/weak-password") msg = "Password must be at least 6 characters";
    return { success: false, error: msg };
  }
}

// ----------------------
// Login
// ----------------------
export async function loginUser(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCred.user };
  } catch (error) {
    let msg = "Login failed";
    if (error.code === "auth/user-not-found") msg = "User does not exist";
    if (error.code === "auth/wrong-password") msg = "Wrong password";
    if (error.code === "auth/invalid-email") msg = "Invalid email format";
    return { success: false, error: msg };
  }
}

// ----------------------
// Logout
// ----------------------
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ----------------------
// createTransaction
// - Checks receiver exists (by email OR username)
// - Basic validation (amount > 0)
// - Stores transaction doc in "transactions"
// - Returns { success, status, transaction } where status is SUCCESS/FAILED
// ----------------------
export async function createTransaction(userId, amount, receiverIdentifier, note) {
  try {
    // basic validation
    if (!amount || Number(amount) <= 0) {
      const txFail = {
        userId,
        amount,
        receiver: receiverIdentifier,
        note: note || "",
        status: "FAILED",
        reason: "Invalid amount",
        timestamp: serverTimestamp(),
        transactionId: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      };
      await addDoc(collection(db, "transactions"), txFail);
      return { success: false, error: "Invalid amount", transaction: txFail };
    }

    if (!receiverIdentifier || receiverIdentifier.trim() === "") {
      const txFail = {
        userId,
        amount,
        receiver: receiverIdentifier,
        note: note || "",
        status: "FAILED",
        reason: "Receiver required",
        timestamp: serverTimestamp(),
        transactionId: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      };
      await addDoc(collection(db, "transactions"), txFail);
      return { success: false, error: "Receiver required", transaction: txFail };
    }

    // Try find receiver by email OR username
    const usersRef = collection(db, "users");
    const qEmail = query(usersRef, where("email", "==", receiverIdentifier));
    const qUsername = query(usersRef, where("username", "==", receiverIdentifier));

    const [snapEmail, snapUsername] = await Promise.all([getDocs(qEmail), getDocs(qUsername)]);
    let receiverDoc = null;
    if (!snapEmail.empty) receiverDoc = snapEmail.docs[0];
    else if (!snapUsername.empty) receiverDoc = snapUsername.docs[0];

    if (!receiverDoc) {
      // receiver not found — record failed transaction
      const txFail = {
        userId,
        amount,
        receiver: receiverIdentifier,
        note: note || "",
        status: "FAILED",
        reason: "Receiver not found",
        timestamp: serverTimestamp(),
        transactionId: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      };
      await addDoc(collection(db, "transactions"), txFail);
      return { success: false, error: "Receiver not found", transaction: txFail };
    }

    // Optional: check receiver document fields (e.g., active/inactive)
    // Optional: check sender balance if you store balances (not implemented here)

    // Simulate other checks (example: 'expired' in receiver -> failure)
    if (String(receiverIdentifier).toLowerCase().includes("expired")) {
      const txFail = {
        userId,
        amount,
        receiver: receiverIdentifier,
        note: note || "",
        status: "FAILED",
        reason: "Card expired or invalid receiver",
        timestamp: serverTimestamp(),
        transactionId: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      };
      await addDoc(collection(db, "transactions"), txFail);
      return { success: false, error: "Card expired or invalid receiver", transaction: txFail };
    }

    // All good → create success transaction
    const tx = {
      userId,
      amount: Number(amount),
      receiver: receiverIdentifier,
      note: note || "",
      status: "SUCCESS",
      timestamp: serverTimestamp(),
      transactionId: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    };

    await addDoc(collection(db, "transactions"), tx);
    return { success: true, status: "SUCCESS", transaction: tx };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ----------------------
// getUserTransactions (real-time listener)
// returns unsubscribe function
// ----------------------
export function getUserTransactions(userId, callback) {
  const q = query(collection(db, "transactions"), where("userId", "==", userId));
  const unsub = onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(transactions);
  });
  return unsub;
}


// -------- REAL-TIME TRANSACTION LISTENER --------
// import { collection, query, where, onSnapshot } from "firebase/firestore";

export function listenToUserTransactions(userId, callback) {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(list);
  });
}
