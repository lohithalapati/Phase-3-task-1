export function AIGeneratingBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/60 border border-primary-neural/30">
      <div className="relative w-2 h-2">
        <div className="absolute inset-0 rounded-full bg-primary-neural animate-pulse" />
      </div>
      <span className="text-xs font-semibold text-white">AI Generating...</span>
    </div>
  );
}
