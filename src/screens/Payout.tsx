import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Wallet, AlertCircle, History, ArrowDownToLine } from 'lucide-react';
import { formatCurrency, cn } from '@/src/lib/utils';
import { User, Withdrawal, PayoutStatus } from '@/src/types';

interface PayoutProps {
  user: User | null;
  withdrawals: Withdrawal[];
  onWithdraw: (amount: number, address: string) => void;
}

export default function Payout({ user, withdrawals, onWithdraw }: PayoutProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 0.1 && numAmount <= 1.0 && address) {
      onWithdraw(numAmount, address);
      setAmount('');
      setAddress('');
    }
  };

  const statusColors = {
    [PayoutStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
    [PayoutStatus.APPROVED]: 'bg-green-100 text-green-700',
    [PayoutStatus.REJECTED]: 'bg-red-100 text-red-700',
  };

  return (
    <div className="pt-24 pb-24 px-4 space-y-8">
      {/* Withdraw Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-2"
      >
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-none">
          {t('withdraw_balance')}
        </p>
        <h2 className="text-4xl font-black text-gray-900">
          {formatCurrency(user?.active_balance || 0)}
        </h2>
        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 rounded-full">
          <Wallet className="w-3 h-3 text-purple-primary" />
          <span className="text-[10px] font-bold text-purple-primary uppercase tracking-tighter">TON Network</span>
        </div>
      </motion.div>

      {/* Withdrawal Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-3xl space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
              {t('enter_amount')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min $0.10 / Max $1.00"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
              {t('select_token')}
            </label>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center space-x-3">
              <div className="bg-blue-500 p-1.5 rounded-full">
                <ArrowDownToLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700">TON (The Open Network)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
              {t('wallet_address')}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="v1_addr_..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
          <p className="text-xs text-orange-700 leading-relaxed font-medium">
            {t('withdrawal_fee')}: <span className="font-bold underline">$0.02</span>
            <br />
            Withdrawals are processed within 24 hours.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || !address}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl",
            (amount && address) ? "purple-gradient text-white shadow-purple-primary/20" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
          )}
        >
          {t('submit_payout')}
        </button>
      </motion.div>

      {/* History */}
      <div className="space-y-4 pb-8">
        <div className="flex items-center space-x-2 px-1">
          <History className="w-5 h-5 text-gray-400 font-bold" />
          <h3 className="font-bold text-gray-900 tracking-tight">{t('withdraw_history')}</h3>
        </div>

        <div className="space-y-3">
          {withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm italic">No withdrawal history yet.</p>
            </div>
          ) : (
            withdrawals.map((w, idx) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <Wallet className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(w.amount)}</p>
                    <p className="text-[10px] text-gray-400 font-medium truncate w-32">{w.ton_address}</p>
                  </div>
                </div>
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter", statusColors[w.status])}>
                  {w.status}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
