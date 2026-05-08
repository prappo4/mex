import { supabase } from '@/src/lib/supabase';
import { User, Task, TaskSubmission, Withdrawal, TaskStatus, PayoutStatus } from '@/src/types';

export const supabaseService = {
  // IP Service
  async getClientIp(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (e) {
      console.error('Failed to fetch IP', e);
      return 'unknown';
    }
  },

  // User Profile
  async getUser(telegramId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data as User;
  },

  async createUser(user: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...user,
        active_balance: 0,
        pending_balance: 0,
        team_balance: 0,
        team_size: 0,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    return data as User;
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    return data as Task[];
  },

  async createTask(task: Partial<Task>): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        created_at: new Date().toISOString(),
      }]);

    if (error) console.error('Error creating task:', error);
  },

  // Task Submission
  async submitTask(submission: Partial<TaskSubmission>, amount: number): Promise<boolean> {
    try {
      // Record submission
      const { error: subError } = await supabase
        .from('task_submissions')
        .insert([{
          ...submission,
          status: TaskStatus.PENDING,
          submitted_at: new Date().toISOString(),
        }]);

      if (subError) throw subError;

      // Update user pending balance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('pending_balance')
        .eq('telegram_id', submission.user_id)
        .single();

      if (userError) throw userError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ pending_balance: (user.pending_balance || 0) + amount })
        .eq('telegram_id', submission.user_id);

      if (updateError) throw updateError;

      return true;
    } catch (e) {
      console.error('Task submission error:', e);
      return false;
    }
  },

  // Withdrawals
  async requestWithdrawal(withdrawal: Partial<Withdrawal>): Promise<boolean> {
    try {
      // 1. Check balance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('active_balance')
        .eq('telegram_id', withdrawal.user_id)
        .single();

      if (userError || !user) throw new Error('User not found');
      if (user.active_balance < withdrawal.amount!) throw new Error('Insufficient balance');

      // 2. Record withdrawal
      const { error: withError } = await supabase
        .from('withdrawals')
        .insert([{
          ...withdrawal,
          status: PayoutStatus.PENDING,
          created_at: new Date().toISOString(),
        }]);

      if (withError) throw withError;

      // 3. Deduct balance
      const { error: updateError } = await supabase
        .from('users')
        .update({ active_balance: user.active_balance - withdrawal.amount! })
        .eq('telegram_id', withdrawal.user_id);

      if (updateError) throw updateError;

      return true;
    } catch (e) {
      console.error('Withdrawal error:', e);
      return false;
    }
  },

  async getWithdrawals(telegramId: string): Promise<Withdrawal[]> {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', telegramId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return [];
    }
    return data as Withdrawal[];
  }
};
