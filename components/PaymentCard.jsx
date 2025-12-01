'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Dropdown from './Dropdown';
import InputField from './InputField';

export default function PaymentCard({ onSuccess }) {
  const [network, setNetwork] = useState('Ethereum');
  const [token, setToken] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Pay with Elite Card</h2>

      <div className="space-y-4">
        <Dropdown
          label="Network"
          options={['Ethereum', 'Polygon', 'BSC', 'Arbitrum']}
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        />

        <Dropdown
          label="Token"
          options={['USDT', 'USDC', 'DAI', 'ETH']}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <InputField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Accept Payment'}
        </motion.button>
      </div>
    </motion.div>
  );
}

