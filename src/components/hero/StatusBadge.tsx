import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  text?: string;
}

const StatusBadge = ({ text = 'Disponível para oportunidades' }: StatusBadgeProps) => {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <motion.span
        className="relative flex h-2 w-2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </motion.span>
      <span className="text-sm font-medium text-foreground/80">{text}</span>
      <Sparkles className="h-3 w-3 text-primary" />
    </motion.div>
  );
};

export default StatusBadge;
