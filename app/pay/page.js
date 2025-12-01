// app/pay/page.js
"use client";

import React, { useEffect, useState } from "react";
import { createTransaction, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function PayPage() {
  const router = useRouter();
  const [network, setNetwork] = useState("Ethereum");
  const [token, setToken] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const u = auth.currentUser;
    if (u) setUserId(u.uid);
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsub && unsub();
  }, []);

  const handlePay = async (e) => {
    e?.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount (> 0)");
      return;
    }
    if (!receiver || receiver.trim() === "") {
      setError("Receiver is required (email or username)");
      return;
    }
    if (!userId) {
      setError("You must be signed in to make a payment");
      return;
    }

    setLoading(true);
    const res = await createTransaction(userId, Number(amount), receiver.trim(), note);
    setLoading(false);

    if (!res.success) {
      // route to failed page — you can show details in history
      router.push("/failed");
      return;
    }

    // success
    router.push("/success");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pay with Elite Card</h1>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <div className="grid gap-4">
          <label className="text-sm">Network</label>
          <select className="p-3 rounded bg-slate-900" value={network} onChange={(e) => setNetwork(e.target.value)}>
            <option>Ethereum</option>
            <option>Polygon</option>
            <option>BSC</option>
            <option>Arbitrum</option>
          </select>

          <label className="text-sm">Token</label>
          <select className="p-3 rounded bg-slate-900" value={token} onChange={(e) => setToken(e.target.value)}>
            <option>USDT</option>
            <option>USDC</option>
            <option>DAI</option>
            <option>ETH</option>
          </select>

          <label className="text-sm">Amount</label>
          <input type="number" className="p-3 rounded bg-slate-900" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <label className="text-sm">Receiver (email or username)</label>
          <input type="text" className="p-3 rounded bg-slate-900" placeholder="receiver@example.com or username" value={receiver} onChange={(e) => setReceiver(e.target.value)} />

          <label className="text-sm">Note (optional)</label>
          <input type="text" className="p-3 rounded bg-slate-900" placeholder="For fuel..." value={note} onChange={(e) => setNote(e.target.value)} />

          {error && <div className="text-red-400">{error}</div>}

          <button onClick={handlePay} disabled={loading} className="mt-2 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded font-semibold disabled:opacity-60">
            {loading ? "Processing..." : "Accept Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
