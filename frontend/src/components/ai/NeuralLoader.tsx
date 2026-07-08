export function NeuralLoader() {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full bg-primary-neural animate-pulse"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s',
          }}
        />
      ))}
      <div className="absolute w-20 h-1 bg-gradient-to-r from-primary-neural/30 via-primary-neural/50 to-transparent rounded-full blur-sm animate-pulse" />
    </div>
  );
}
