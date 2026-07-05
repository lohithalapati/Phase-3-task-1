import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-neural-cyan animate-pulse"></span>
          <span className="text-sm font-medium text-slate-300">Enterprise Knowledge Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-neural-blue via-neural-cyan to-aurora-violet">NeuralHandoff</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Stop searching. Start asking. Secure, AI-powered knowledge retrieval for your entire organization.
        </p>

        <button className="px-8 py-4 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          Access Platform
        </button>
      </motion.div>
    </div>
  );
}
