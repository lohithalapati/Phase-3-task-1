import { NeuralNetwork } from './NeuralNetwork';

export function GlobalBackground() {
  return (
    <div className='fixed inset-0 -z-50 h-full w-full bg-background-primary overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-background-primary via-[#0a0d18] to-background-secondary' />
      <div className='absolute inset-0 animate-aurora' style={{
        backgroundImage: 'radial-gradient(ellipse 800px 500px at 40% 30%, rgba(37, 99, 235, 0.15), transparent), radial-gradient(ellipse 600px 400px at 70% 60%, rgba(6, 182, 212, 0.1), transparent)',
      }} />
      <NeuralNetwork />
    </div>
  );
}