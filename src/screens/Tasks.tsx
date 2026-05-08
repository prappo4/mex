import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Flame, ArrowRight, Upload, CheckCircle2, X } from 'lucide-react';
import { formatCurrency, cn } from '@/src/lib/utils';
import { Task, TaskStatus } from '@/src/types';
import confetti from 'canvas-confetti';

interface TasksProps {
  tasks: Task[];
  onTaskSubmit: (taskId: string, proofText: string) => void;
}

export default function Tasks({ tasks, onTaskSubmit }: TasksProps) {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [proof, setProof] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleStartExecution = (url: string) => {
    window.open(url, '_blank');
    setIsExecuting(true);
  };

  const handleSubmit = () => {
    if (selectedTask) {
      onTaskSubmit(selectedTask.id, proof);
      setSelectedTask(null);
      setProof('');
      setIsExecuting(false);
      setShowSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#5B21B6', '#FFFFFF']
      });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="pt-24 pb-24 px-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t('available_tasks')}</h2>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-3xl p-5 shadow-sm border-l-4 border-l-purple-primary glass-card border border-gray-100 active:scale-95 transition-transform"
            onClick={() => setSelectedTask(task)}
          >
            {task.is_hot && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg shadow-orange-500/20">
                <Flame className="w-3 h-3 text-white fill-current" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider italic">Hot</span>
              </div>
            )}

            <div className="pr-12">
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-primary transition-colors">
                {task.title}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-1 mb-3">{task.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="bg-green-50 px-2 py-1 rounded-lg">
                  <span className="text-green-600 font-bold text-sm">+{formatCurrency(task.amount)}</span>
                </div>
                <button className="purple-gradient p-2 rounded-xl">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-[40px] z-[70] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTask.title}</h3>
                  <div className="bg-green-50 inline-block px-3 py-1 rounded-full">
                    <span className="text-green-600 font-bold text-sm">+{formatCurrency(selectedTask.amount)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800 text-sm">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedTask.description}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border-l-4 border-l-purple-primary">
                  <h4 className="font-bold text-purple-primary text-sm mb-2">{t('proof_submission')}</h4>
                  <p className="text-purple-900/70 text-xs italic leading-relaxed">
                    {selectedTask.proof_requirements}
                  </p>
                </div>

                {!isExecuting ? (
                  <button
                    onClick={() => handleStartExecution(selectedTask.execution_url)}
                    className="w-full purple-gradient py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-purple-primary/20 active:scale-95 transition-transform"
                  >
                    <span className="text-white font-bold">{t('start_execution')}</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <textarea
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                      placeholder={t('proof_placeholder')}
                      className="w-full h-32 bg-gray-50 rounded-2xl p-4 text-sm border border-gray-200 focus:border-purple-primary focus:ring-0 transition-colors"
                    />
                    
                    <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2 text-gray-400 hover:border-purple-primary hover:text-purple-primary transition-colors cursor-pointer">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-medium">{t('upload_screenshot')}</span>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!proof}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold transition-all shadow-xl",
                        proof ? "purple-gradient text-white shadow-purple-primary/20" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
                      )}
                    >
                      {t('submit_payout')}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-[100] px-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 text-center shadow-2xl border border-white/50 w-full max-w-xs">
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('success_message')}</h3>
              <p className="text-gray-500 text-sm">Your proof has been submitted for review.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
