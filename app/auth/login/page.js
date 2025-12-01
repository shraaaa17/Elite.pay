// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import AnimatedBackground from '@/components/AnimatedBackground';
// import InputField from '@/components/InputField';
// import { handleLogin } from '@/lib/firebase';

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async () => {
//     await handleLogin(email, password);
//     router.push('/dashboard');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <AnimatedBackground />

//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-md"
//       >
//         <div className="text-center mb-8">
//           <motion.h1
//             initial={{ y: -20 }}
//             animate={{ y: 0 }}
//             className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
//           >
//             Elite Pay
//           </motion.h1>
//           <p className="text-gray-400">Welcome back</p>
//         </div>

//         <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 p-8 shadow-2xl">
//           <div className="space-y-6">
//             <InputField
//               label="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="your@email.com"
//             />

//             <InputField
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//             />

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleSubmit}
//               className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
//             >
//               Sign In
//             </motion.button>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               onClick={() => router.push('/auth/signup')}
//               className="text-blue-400 hover:text-blue-300 transition-colors"
//             >
//               Don't have an account? Create one
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// pages/auth/login.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import InputField from "@/components/InputField";

// FIXED PATH → correct relative import for your project
import { loginUser } from "../../../lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await loginUser(email, password);

    setLoading(false);

    if (res.success) {
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } else {
      alert(res.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
          >
            Elite Pay
          </motion.h1>
          <p className="text-gray-400">Welcome back</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <div className="space-y-6">

            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/auth/signup")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Don't have an account? Create one
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
