import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Users, Copy, Share2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import { User } from '@/src/types';

interface TeamProps {
  user: User | null;
}

export default function Team({ user }: TeamProps) {
  const { t } = useTranslation();
  const referralLink = `https://t.me/your_bot?start=ref_${user?.telegram_id || '0'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    // Add toast or feedback here
  };

  return (
    <div className="pt-24 pb-24 px-4 space-y-8">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="purple-gradient p-6 rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-purple-primary/20"
      >
        <div className="space-y-1">
          <h3 className="font-bold text-lg leading-tight">{t('referral_bonus_note')}</h3>
          <p className="text-white/70 text-xs">Unlock passive income today</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      {/* Stats Card */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-3xl space-y-2 border-b-4 border-b-purple-primary/20"
        >
          <div className="flex items-center space-x-2 text-purple-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('team_balance')}</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{formatCurrency(user?.team_balance || 0)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-3xl space-y-2 border-b-4 border-b-purple-primary/20"
        >
          <div className="flex items-center space-x-2 text-purple-primary">
            <Users className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('team_size')}</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{user?.team_size || 0}</p>
        </motion.div>
      </div>

      {/* Referral Link Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-3xl space-y-4"
      >
        <h4 className="font-bold text-gray-800 text-sm italic">{t('invite_link')}</h4>
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <span className="text-gray-500 text-xs font-mono truncate mr-4">{referralLink}</span>
          <button
            onClick={copyLink}
            className="p-2 bg-purple-100 rounded-xl hover:bg-purple-200 transition-colors"
          >
            <Copy className="w-4 h-4 text-purple-primary" />
          </button>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={copyLink}
            className="flex-1 purple-gradient py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-purple-primary/10 active:scale-95 transition-transform"
          >
            <Copy className="w-4 h-4" />
            <span>{t('copy_link')}</span>
          </button>
          <button className="flex-1 bg-white border border-purple-primary/20 py-4 rounded-2xl text-purple-primary font-bold text-sm flex items-center justify-center space-x-2 active:scale-95 transition-transform">
            <Share2 className="w-4 h-4" />
            <span>{t('share')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
