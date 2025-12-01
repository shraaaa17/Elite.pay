// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import AnimatedBackground from '@/components/AnimatedBackground';
// import InputField from '@/components/InputField';
// import { handleSignup } from '@/lib/firebase';

// export default function SignupPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSubmit = async () => {
//     if (password !== confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }
//     await handleSignup(username, email, password);
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
//           <p className="text-gray-400">Create your account</p>
//         </div>

//         <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 p-8 shadow-2xl">
//           <div className="space-y-6">
//             <InputField
//               label="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="johndoe"
//             />

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

//             <InputField
//               label="Confirm Password"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//             />

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleSubmit}
//               className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
//             >
//               Create Account
//             </motion.button>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               onClick={() => router.push('/auth/login')}
//               className="text-blue-400 hover:text-blue-300 transition-colors"
//             >
//               Already have an account? Sign in
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// pages/auth/signup.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import InputField from "@/components/InputField";

// Correct Firebase function
import { signupUser } from "../../../lib/firebase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const username = email.split("@")[0];

    setLoading(true);
    const res = await signupUser(email, password, username);
    setLoading(false);

    if (res.success) {
      // Auto-login successful → Go to dashboard
      router.push("/dashboard");
    } else {
      alert(res.error || "Signup failed");
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
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
          >
            Create Account
          </motion.h1>
          <p className="text-gray-400">Join Elite Pay today</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 p-8 shadow-xl">
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

            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/auth/login")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

