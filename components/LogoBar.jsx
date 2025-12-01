'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LogoBar() {
  return (
    <div className="flex items-center justify-end p-6 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">

      {/* LEFT LOGO — Elite Pay (now moved to the right side) */}

      {/* RIGHT SECTION: GasYard + Elite Pay */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-6"
      >
        {/* GasYard */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/logos/gaslogo.png"
              width={60}
              height={60}
              alt="GasYard Logo"
            />
          </div>
          <span className="text-lg font-medium text-gray-300">GasYard</span>
        </div>

        {/* Elite Pay */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/logos/elitelogo.png"
              width={40}
              height={40}
              alt="Elite Pay Logo"
              className="rounded-md"
            />
          </div>
          <span className="text-xl font-semibold text-white">Elite Pay</span>
        </div>
      </motion.div>

    </div>
  );
}
