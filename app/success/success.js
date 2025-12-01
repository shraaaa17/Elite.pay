// app/success/page.js
"use client";

import React from "react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-slate-800/50 p-12 rounded-2xl border border-slate-700 text-center max-w-md">
        <div className="mb-6">
          <svg viewBox="0 0 52 52" className="w-20 h-20 mx-auto mb-2">
            <circle cx="26" cy="26" r="25" stroke="#2D8CFF" strokeWidth="2" fill="none" />
            <path d="M14 27l7 7 16-16" stroke="#2D8CFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
          <h2 className="text-2xl font-bold">Payment Successful</h2>
        </div>

        <p className="text-gray-300 mb-6">Your transaction was processed and saved to history.</p>

        <div className="flex gap-3 justify-center">
          <Link href="/pay" className="px-6 py-2 bg-blue-600 rounded">Make Another</Link>
          <Link href="/dashboard/transactions" className="px-6 py-2 bg-slate-700 rounded">View History</Link>
        </div>
      </div>
    </div>
  );
}
