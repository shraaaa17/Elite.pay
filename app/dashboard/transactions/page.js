// // app/dashboard/transactions/page.js
// "use client";

// import React, { useEffect, useState } from "react";
// import { getUserTransactions, auth } from "@/lib/firebase";

// export default function TransactionsPage() {
//   const [txs, setTxs] = useState([]);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const u = auth.currentUser;
//     if (u) setUserId(u.uid);
//     const unsubAuth = auth.onAuthStateChanged((user) => {
//       if (user) setUserId(user.uid);
//       else setUserId(null);
//     });

//     let unsubTx = null;
//     if (userId) {
//       unsubTx = getUserTransactions(userId, (transactions) => {
//         // Firestore serverTimestamp returns Timestamp; keep as-is and sort by timestamp if available
//         const sorted = transactions.sort((a, b) => {
//           const ta = a.timestamp?.seconds ? a.timestamp.seconds : 0;
//           const tb = b.timestamp?.seconds ? b.timestamp.seconds : 0;
//           return tb - ta;
//         });
//         setTxs(sorted);
//       });
//     }

//     return () => {
//       unsubAuth && unsubAuth();
//       unsubTx && unsubTx();
//     };
//   }, [userId]);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

//       <div className="space-y-4">
//         {txs.length === 0 && <div className="text-gray-400">No transactions yet.</div>}

//         {txs.map((tx) => (
//           <div key={tx.transactionId || tx.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="text-lg font-semibold">₹ {tx.amount}</div>
//                 <div className="text-sm text-gray-400">{tx.receiver} • {tx.status} {tx.reason ? `• ${tx.reason}` : ""}</div>
//                 <div className="text-xs text-gray-500 mt-1">ID: {tx.transactionId || tx.id}</div>
//               </div>
//               <div className="text-xs text-gray-400">
//                 {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleString() : tx.timestamp ? new Date(tx.timestamp).toLocaleString() : ""}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { listenToUserTransactions } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import SidePanel from "@/components/SidePanel";
import AnimatedBackground from "@/components/AnimatedBackground";
import LogoBar from "@/components/LogoBar";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Listen to real-time transaction updates
    const unsubscribe = listenToUserTransactions(user.uid, (list) => {
      // Sort latest first
      list.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(list);
    });

    return () => unsubscribe();
  }, []);

  const statusColor = {
    SUCCESS: "bg-green-500/20 text-green-400 border border-green-500/40",
    FAILED: "bg-red-500/20 text-red-400 border border-red-500/40",
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      <div className="relative">
        <LogoBar />

        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed top-6 left-6 z-30 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">
            Transaction History
          </h1>

          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        ₹{tx.amount}
                      </h2>

                      <p className="text-gray-400 text-sm mt-1">
                        To: {tx.receiver}
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[tx.status]
                        }`}
                    >
                      {tx.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mt-3">
                    Payment ID: {tx.transactionId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
