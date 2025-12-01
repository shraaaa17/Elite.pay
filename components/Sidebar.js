// components/Sidebar.js
"use client";

import React from "react";
import Link from "next/link";
import { logoutUser } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Elite Pay</h2>
        <p className="text-sm text-gray-400">Merchant Terminal</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/pay" className="px-4 py-3 rounded hover:bg-slate-800">Pay with Elite Card</Link>
        <Link href="/dashboard/transactions" className="px-4 py-3 rounded hover:bg-slate-800">Transaction History</Link>
        <Link href="/dashboard/Add-product" className="px-4 py-3 rounded hover:bg-slate-800">Add Product</Link>
        <button onClick={handleLogout} className="mt-8 px-4 py-3 rounded bg-red-600 hover:bg-red-700">Logout</button>
      </nav>
    </aside>
  );
}
