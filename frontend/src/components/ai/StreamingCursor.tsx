import { motion } from 'framer-motion';

export function StreamingCursor() {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className="inline-block w-2 h-5 bg-primary-neural rounded-sm ml-1"
    />
  );
}
