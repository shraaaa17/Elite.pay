// app/failed/page.js
"use client";

import React from "react";
import Link from "next/link";

export default function FailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-slate-800/50 p-12 rounded-2xl border border-slate-700 text-center max-w-md">
        <div className="mb-6">
          <svg viewBox="0 0 52 52" className="w-20 h-20 mx-auto mb-2">
            <circle cx="26" cy="26" r="25" stroke="#FF6B6B" strokeWidth="2" fill="none" />
            <path d="M16 16l20 20M36 16L16 36" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h2 className="text-2xl font-bold">Payment Failed</h2>
        </div>

        <p className="text-gray-300 mb-6">Something went wrong. The transaction was recorded as failed.</p>

        <div className="flex gap-3 justify-center">
          <Link href="/pay" className="px-6 py-2 bg-blue-600 rounded">Try Again</Link>
          <Link href="/dashboard/transactions" className="px-6 py-2 bg-slate-700 rounded">View History</Link>
        </div>
      </div>
    </div>
  );
}
