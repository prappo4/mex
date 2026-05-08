import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      task: 'Task',
      team: 'Team',
      payout: 'Payout',
      active_balance: 'Active Balance',
      pending_balance: 'Pending Balance',
      available_tasks: 'Available Tasks',
      start_task: 'Start Task',
      team_balance: 'Team Balance',
      team_size: 'Team Size',
      invite_link: 'Your Invite Link',
      copy_link: 'Copy Link',
      share: 'Share',
      withdraw_balance: 'Withdrawal Balance',
      withdraw_history: 'Withdrawal History',
      enter_amount: 'Enter Amount',
      select_token: 'Select Token',
      wallet_address: 'Enter TON Wallet Address',
      submit_payout: 'Submit Payout',
      withdrawal_fee: 'Withdrawal Fee',
      referral_bonus_note: 'Earn $0.01 for every valid referral!',
      success_message: 'Task Submitted Successfully!',
      proof_submission: 'What you must submit to verify',
      start_execution: 'Start Execution',
      proof_placeholder: 'Write your proof here...',
      upload_screenshot: 'Upload Screenshot / File'
    }
  },
  zh: {
    translation: {
      dashboard: '仪表板',
      task: '任务',
      team: '团队',
      payout: '支付',
      active_balance: '可用余额',
      pending_balance: '待定余额',
      available_tasks: '可用任务',
      start_task: '开始任务',
      team_balance: '团队余额',
      team_size: '团队规模',
      invite_link: '您的邀请链接',
      copy_link: '复制链接',
      share: '分享',
      withdraw_balance: '提现余额',
      withdraw_history: '提现历史',
      enter_amount: '输入金额',
      select_token: '选择代币',
      wallet_address: '输入 TON 钱包地址',
      submit_payout: '提交支付',
      withdrawal_fee: '提现费用',
      referral_bonus_note: '每位有效推荐可赚取 $0.01！',
      success_message: '任务提交成功！',
      proof_submission: '验证所需的提交内容',
      start_execution: '开始执行',
      proof_placeholder: '在此处写下您的证明...',
      upload_screenshot: '上传截图/文件'
    }
  },
  es: {
    translation: {
      dashboard: 'Panel',
      task: 'Tarea',
      team: 'Equipo',
      payout: 'Pago',
      active_balance: 'Saldo Activo',
      pending_balance: 'Saldo Pendiente',
      available_tasks: 'Tareas Disponibles',
      start_task: 'Iniciar Tarea',
      team_balance: 'Saldo del Equipo',
      team_size: 'Tamaño del Equipo',
      invite_link: 'Tu Link de Invitación',
      copy_link: 'Copiar Link',
      share: 'Compartir',
      withdraw_balance: 'Saldo de Retiro',
      withdraw_history: 'Historial de Retiros',
      enter_amount: 'Ingresar Monto',
      select_token: 'Seleccionar Token',
      wallet_address: 'Ingresar Dirección de Billetera TON',
      submit_payout: 'Enviar Pago',
      withdrawal_fee: 'Comisión de Retiro',
      referral_bonus_note: '¡Gana $0.01 por cada referido válido!',
      success_message: '¡Tarea Enviada con Éxito!',
      proof_submission: 'Qué debes enviar para verificar',
      start_execution: 'Iniciar Ejecución',
      proof_placeholder: 'Escribe tu prueba aquí...',
      upload_screenshot: 'Subir Captura / Archivo'
    }
  },
  pt: {
    translation: {
      dashboard: 'Painel',
      task: 'Tarefa',
      team: 'Equipe',
      payout: 'Saque',
      active_balance: 'Saldo Ativo',
      pending_balance: 'Saldo Pendente',
      available_tasks: 'Tarefas Disponíveis',
      start_task: 'Iniciar Tarefa',
      team_balance: 'Saldo da Equipe',
      team_size: 'Tamanho da Equipe',
      invite_link: 'Seu Link de Convite',
      copy_link: 'Copiar Link',
      share: 'Compartilhar',
      withdraw_balance: 'Saldo de Saque',
      withdraw_history: 'Histórico de Saques',
      enter_amount: 'Digitar Valor',
      select_token: 'Selecionar Token',
      wallet_address: 'Digitar Endereço da Carteira TON',
      submit_payout: 'Enviar Solicitação',
      withdrawal_fee: 'Taxa de Saque',
      referral_bonus_note: 'Ganhe $0.01 por cada indicação válida!',
      success_message: 'Tarefa Enviada com Sucesso!',
      proof_submission: 'O que você deve enviar para verificar',
      start_execution: 'Iniciar Execução',
      proof_placeholder: 'Escreva sua prova aqui...',
      upload_screenshot: 'Enviar Print / Arquivo'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
