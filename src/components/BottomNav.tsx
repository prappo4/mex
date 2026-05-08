import { Home, ClipboardList, Users, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', icon: Home, label: t('dashboard') },
    { id: 'task', icon: ClipboardList, label: t('task') },
    { id: 'team', icon: Users, label: t('team') },
    { id: 'payout', icon: DollarSign, label: t('payout') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-purple-primary/20 pb-safe shadow-[0_-4px_16px_rgba(124,58,237,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 active:scale-90"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-[1px] w-12 h-[3px] bg-purple-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isActive ? "text-purple-primary fill-purple-primary/10" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-300",
                  isActive ? "text-purple-primary" : "text-gray-400"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
