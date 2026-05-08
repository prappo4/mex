export enum TaskStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum PayoutStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface User {
  id: string;
  telegram_id: string;
  username: string;
  first_name: string;
  photo_url: string;
  ip_address: string;
  referral_code: string;
  referred_by: string | null;
  active_balance: number;
  pending_balance: number;
  team_balance: number;
  team_size: number;
  created_at: any;
  language: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  execution_url: string;
  proof_requirements: string;
  amount: number;
  is_hot: boolean;
  is_active: boolean;
  created_at: any;
}

export interface TaskSubmission {
  id: string;
  user_id: string;
  task_id: string;
  proof_text: string;
  proof_file_url: string | null;
  status: TaskStatus;
  submitted_at: any;
  reviewed_at: any | null;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  ton_address: string;
  status: PayoutStatus;
  created_at: any;
}
