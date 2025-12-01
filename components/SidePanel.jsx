// 'use client';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { handleLogout } from '@/lib/firebase';

// export default function SidePanel({ isOpen, onClose }) {
//   const router = useRouter();

//   const menuItems = [
//     { label: 'Pay with Elite Cards', path: '/dashboard' },
//     { label: 'Transaction History', path: '/dashboard/transactions' },
//     { label: 'Add Product', path: '/dashboard/add-product' },
//     { label: 'Logout', action: 'logout' },
//   ];

//   const handleNavigation = async (item) => {
//     if (item.action === 'logout') {
//       await handleLogout();
//       router.push('/auth/login');
//     } else {
//       router.push(item.path);
//     }
//     onClose();
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//             onClick={onClose}
//           />
//         )}
//       </AnimatePresence>

//       <motion.div
//         initial={{ x: '-100%' }}
//         animate={{ x: isOpen ? 0 : '-100%' }}
//         transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//         className="fixed left-0 top-0 h-full w-80 bg-slate-900 border-r border-slate-800 z-50 shadow-2xl"
//       >
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-xl font-bold text-white">Menu</h2>
//             <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <nav className="space-y-2">
//             {menuItems.map((item, idx) => (
//               <motion.button
//                 key={idx}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 onClick={() => handleNavigation(item)}
//                 className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-all"
//               >
//                 {item.label}
//               </motion.button>
//             ))}
//           </nav>
//         </div>
//       </motion.div>
//     </>
//   );
// }

// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";

// // FIXED IMPORT ✔
// import { logoutUser } from "@/lib/firebase";

// export default function SidePanel({ isOpen, onClose }) {
//   const router = useRouter();

//   const menuItems = [
//     { label: "Pay with Elite Cards", path: "/dashboard" },
//     { label: "Transaction History", path: "/dashboard/transactions" },
//     { label: "Add Product", path: "/dashboard/Add-product" },
//     { label: "Logout", action: "logout" },
//   ];

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="fixed inset-0 bg-black/50 z-40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />
//         )}
//       </AnimatePresence>

//       <motion.div
//         className="fixed top-0 left-0 w-72 h-full bg-slate-900 z-50 p-6 border-r border-slate-700"
//         initial={{ x: "-100%" }}
//         animate={{ x: isOpen ? 0 : "-100%" }}
//         transition={{ type: "spring", stiffness: 200, damping: 25 }}
//       >
//         <h2 className="text-xl text-white font-bold mb-6">Menu</h2>

//         <nav className="space-y-2">
//           {menuItems.map((item, idx) => (
//             <motion.button
//               key={idx}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className="w-full text-left px-4 py-3 text-gray-300 rounded-lg hover:bg-slate-800 transition-all"
//               onClick={async () => {
//                 if (item.action === "logout") {
//                   await logoutUser();       // FIXED ✔
//                   router.push("/auth/login");
//                 } else {
//                   router.push(item.path);
//                 }
//                 onClose();
//               }}
//             >
//               {item.label}
//             </motion.button>
//           ))}
//         </nav>
//       </motion.div>
//     </>
//   );
// }

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/firebase";

export default function SidePanel({ isOpen, onClose }) {
  const router = useRouter();

  const menu = [
    { label: "Pay with Elite Cards", path: "/dashboard" },
    { label: "Transaction History", path: "/dashboard/transactions" },
    { label: "Add Product", path: "/dashboard/Add-product" },
    { label: "Logout", action: "logout" },
  ];

  const handleClick = async (item) => {
    if (item.action === "logout") {
      await logoutUser();
      router.push("/auth/login");
      return;
    }

    router.push(item.path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 p-6 border-r border-slate-700"
      >
        <h2 className="text-xl text-white font-bold mb-6">Menu</h2>

        <div className="space-y-3">
          {menu.map((item, i) => (
            <button
              key={i}
              onClick={() => handleClick(item)}
              className="w-full text-left text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
