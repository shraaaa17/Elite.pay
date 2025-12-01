"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SidePanel from "@/components/SidePanel";
import AnimatedBackground from "@/components/AnimatedBackground";
import LogoBar from "@/components/LogoBar";
import PaymentCard from "@/components/PaymentCard";
import AnimatedCheckmark from "@/components/AnimatedCheckmark";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <AnimatedBackground />

      {/* SIDE PANEL */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      {/* CONTENT */}
      <div className="relative">
        <LogoBar />

        {/* Open Sidebar Button */}
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed top-6 left-6 z-30 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="container mx-auto px-4 py-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >

            {/* PAYMENT CARD OR SUCCESS */}
            {!showSuccess ? (
              <PaymentCard onSuccess={() => setShowSuccess(true)} />

            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 p-12 text-center shadow-2xl"
              >
                <AnimatedCheckmark />
                <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-6">Your Elite Pay transaction was completed.</p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSuccess(false)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg"
                >
                  Make Another Payment
                </motion.button>
              </motion.div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
