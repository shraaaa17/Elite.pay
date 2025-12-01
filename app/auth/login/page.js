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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/firebase";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Login Successful → Redirect to Dashboard
    router.push("/dashboard");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">

        <h1 className="text-3xl font-bold text-center mb-6">Elite Pay Login</h1>

        {error && (
          <p className="mb-4 text-red-600 text-center font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-1 border rounded-lg"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-1 border rounded-lg"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-600 font-medium">Create one</a>
        </p>
      </div>
    </div>
  );
}
