import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/src/lib/utils';
import { User } from '@/src/types';

interface DashboardProps {
  user: User | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-20 px-4 flex flex-col space-y-8">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="purple-gradient relative overflow-hidden rounded-[32px] p-8 shadow-2xl floating shadow-purple-primary/20 h-48 flex items-center"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-dark/40 blur-[40px] rounded-full -ml-12 -mb-12" />

        <div className="w-full grid grid-cols-2 gap-4 relative z-10">
          <div className="space-y-1">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
              {t('active_balance')}
            </p>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              {formatCurrency(user?.active_balance || 0)}
            </h2>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
              {t('pending_balance')}
            </p>
            <h3 className="text-xl font-bold text-white/50 tracking-tight">
              {formatCurrency(user?.pending_balance || 0)}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats or Promo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-6 border-l-4 border-l-purple-primary"
      >
        <h4 className="font-bold text-purple-primary text-sm mb-1 uppercase tracking-wide">
          Tip of the day
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          Invite 5 friends today to unlock premium task categories and earn higher commissions!
        </p>
      </motion.div>

      {/* Decorative Blur */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-primary/5 blur-[120px] -z-10 rounded-full" />
    </div>
  );
}
