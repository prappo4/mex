import { Globe, BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface HeaderProps {
  user: {
    photo_url?: string;
    username?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const { i18n } = useTranslation();
  const [showLangs, setShowLangs] = useState(false);

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'zh', flag: '🇨🇳', name: 'Chinese' },
    { code: 'es', flag: '🇪🇸', name: 'Spanish' },
    { code: 'pt', flag: '🇧🇷', name: 'Portuguese' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <img
            src={user.photo_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-purple-primary/20"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
            <BadgeCheck className="w-4 h-4 text-blue-500 fill-current" />
          </div>
        </div>
        <span className="font-bold text-gray-800 text-sm">@{user.username || "username"}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowLangs(!showLangs)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Globe className="w-6 h-6 text-gray-600" />
        </button>

        <AnimatePresence>
          {showLangs && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLangs(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setShowLangs(false);
                    }}
                    className={cn(
                      "flex items-center space-x-3 w-full px-4 py-3 hover:bg-purple-50 transition-colors text-left",
                      i18n.language === lang.code && "bg-purple-50 text-purple-primary font-medium"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
