import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import WebApp from '@twa-dev/sdk';
import { Howl } from 'howler';
import '@/src/lib/i18n';

import Header from '@/src/components/Header';
import BottomNav from '@/src/components/BottomNav';
import Dashboard from '@/src/screens/Dashboard';
import Tasks from '@/src/screens/Tasks';
import Team from '@/src/screens/Team';
import Payout from '@/src/screens/Payout';

import { User, Task, Withdrawal, TaskStatus, PayoutStatus } from '@/src/types';
import { supabaseService } from '@/src/services/supabaseService';
import { supabase } from '@/src/lib/supabase';

// Sounds
const clickSound = new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], volume: 0.5 });
const successSound = new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'], volume: 0.5 });

const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Follow Telegram Channel',
    description: 'Join our official update channel to stay informed about new features.',
    execution_url: 'https://t.me/telegram',
    proof_requirements: 'Submit your Telegram username used to join.',
    amount: 0.05,
    is_hot: true,
    is_active: true,
    created_at: new Date(),
  },
  {
    id: 't2',
    title: 'Retweet & Follow on X',
    description: 'Follow our official X account and retweet the pinned post.',
    execution_url: 'https://x.com',
    proof_requirements: 'Upload a screenshot of the retweet and your X profile.',
    amount: 0.08,
    is_hot: false,
    is_active: true,
    created_at: new Date(),
  },
  {
    id: 't3',
    title: 'Watch YouTube Video',
    description: 'Watch the full video about our project and like it.',
    execution_url: 'https://youtube.com',
    proof_requirements: 'Write a 1-sentence summary of the video content.',
    amount: 0.10,
    is_hot: false,
    is_active: true,
    created_at: new Date(),
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const initApp = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const meta = import.meta as any;
      const hasConfig = meta.env?.VITE_SUPABASE_URL && meta.env?.VITE_SUPABASE_ANON_KEY;

      if (!hasConfig) {
        console.warn("Supabase config missing. Entering preview mode.");
        setIsOfflineMode(true);
        await loadUserData('demo_user_preview', true);
        return;
      }

      setIsOfflineMode(false);
      const tgUser = WebApp.initDataUnsafe.user;
      if (tgUser) {
        await loadUserData(tgUser.id.toString());
      } else {
        // Fallback for browser testing
        await loadUserData('browser_test_user');
      }
    } catch (error: any) {
      console.error("Initialization error:", error);
      setAuthError(error.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string, isForcedOffline: boolean = false) => {
    if (isOfflineMode || isForcedOffline || userId === 'demo_user_preview') {
      setUser({
        id: 'preview_id',
        telegram_id: WebApp.initDataUnsafe.user?.id.toString() || '000000',
        username: WebApp.initDataUnsafe.user?.username || 'Guest',
        first_name: WebApp.initDataUnsafe.user?.first_name || 'Preview User',
        photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=preview`,
        ip_address: '127.0.0.1',
        referral_code: 'PREVIEW',
        referred_by: null,
        active_balance: 0.10,
        pending_balance: 0.05,
        team_balance: 0.00,
        team_size: 0,
        created_at: new Date(),
        language: 'en'
      });
      setTasks(DEFAULT_TASKS);
      return;
    }

    const tgUser = WebApp.initDataUnsafe.user;
    let existingUser = await supabaseService.getUser(userId);
    
    if (!existingUser) {
      const clientIp = await supabaseService.getClientIp();
      const newUser: Partial<User> = {
        telegram_id: userId,
        username: tgUser?.username || 'user_' + userId.substring(0, 5),
        first_name: tgUser?.first_name || 'Member',
        photo_url: tgUser?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        ip_address: clientIp,
        referral_code: userId.substring(0, 6).toUpperCase(),
        referred_by: null,
        language: tgUser?.language_code || 'en'
      };
      existingUser = await supabaseService.createUser(newUser);
    }
    
    setUser(existingUser);

    // 3. Load Tasks
    let allTasks = await supabaseService.getTasks();
    if (allTasks.length === 0) {
      for (const task of DEFAULT_TASKS) {
        await supabaseService.createTask(task);
      }
      allTasks = await supabaseService.getTasks();
    }
    setTasks(allTasks);

    // 4. Load Withdrawals
    const userWithdrawals = await supabaseService.getWithdrawals(userId);
    setWithdrawals(userWithdrawals);
  };

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    initApp();
  }, []);

  /**
   * handleGoogleLogin removed as part of Supabase migration.
   * Supabase Auth can be implemented separately if needed.
   */

  const handleTabChange = (tab: string) => {
    clickSound.play();
    setActiveTab(tab);
  };

  const handleTaskSubmit = async (taskId: string, proofText: string) => {
    if (!user) return;
    
    successSound.play();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (isOfflineMode) {
      setUser(prev => prev ? ({
        ...prev,
        pending_balance: (prev.pending_balance || 0) + task.amount
      }) : null);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      return;
    }

    try {
      await supabaseService.submitTask({
        user_id: user.telegram_id,
        task_id: taskId,
        proof_text: proofText,
      }, task.amount);

      // Optimistic update
      setUser(prev => prev ? ({
        ...prev,
        pending_balance: (prev.pending_balance || 0) + task.amount
      }) : null);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleWithdraw = async (amount: number, address: string) => {
    if (!user) return;
    clickSound.play();

    if (isOfflineMode) {
      setUser(prev => prev ? ({
        ...prev,
        active_balance: prev.active_balance - amount
      }) : null);
      setWithdrawals([{
        id: Math.random().toString(),
        user_id: user.telegram_id,
        amount,
        ton_address: address,
        status: PayoutStatus.PENDING,
        created_at: new Date()
      }, ...withdrawals]);
      return;
    }

    try {
      await supabaseService.requestWithdrawal({
        user_id: user.telegram_id,
        amount,
        ton_address: address,
      });

      // Refresh data
      const updatedUser = await supabaseService.getUser(user.telegram_id);
      const updatedWithdrawals = await supabaseService.getWithdrawals(user.telegram_id);
      setUser(updatedUser);
      setWithdrawals(updatedWithdrawals);
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-purple-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 max-w-sm w-full space-y-6">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔐</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Database Error</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We couldn't connect to Supabase. Please ensure your environment variables are configured correctly.
            </p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={initApp}
              className="w-full purple-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-purple-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              Retry Connection
            </button>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            Dev Tip: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {isOfflineMode && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-purple-primary text-white text-[10px] py-1 px-4 text-center font-bold">
          Preview Mode: Add Supabase credentials for real database integration.
        </div>
      )}
      <Header user={user || {}} />

      <main className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {activeTab === 'home' && <Dashboard user={user} />}
            {activeTab === 'task' && <Tasks tasks={tasks} onTaskSubmit={handleTaskSubmit} />}
            {activeTab === 'team' && <Team user={user} />}
            {activeTab === 'payout' && <Payout user={user} withdrawals={withdrawals} onWithdraw={handleWithdraw} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}
