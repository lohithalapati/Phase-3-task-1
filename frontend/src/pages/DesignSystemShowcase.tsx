import { Button } from '@/components/forms/Button';
import { Glass } from '@/components/ui/Glass';
import { AIGeneratingBadge } from '@/components/ai/AIGeneratingBadge';
import { toast } from 'sonner';

export default function DesignSystemShowcase() {
  return (
    <div className='container mx-auto px-4 py-24'>
      <div className='text-center mb-20'>
        <h1 className='font-serif text-5xl md:text-7xl mb-4 bg-gradient-to-br from-white to-text-muted bg-clip-text text-transparent'>
          NeuralHandoff V5
        </h1>
        <p className='text-xl text-text-muted mx-auto max-w-2xl'>
          Phase 2 is <strong>10/10 Locked</strong>. Enterprise design system.
        </p>
      </div>

      <Glass className='p-8 md:p-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <div className='space-y-8'>
            <h3 className='font-serif text-2xl border-b border-surface-border pb-4'>
              Premium Hover Language
            </h3>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button variant='primary' className='w-full'>
                Primary Action
              </Button>
              <Button variant='secondary' className='w-full'>
                Secondary Action
              </Button>
            </div>

            <h3 className='font-serif text-2xl border-b border-surface-border pb-4 pt-4'>
              Brand Fingerprint
            </h3>
            <div className='flex flex-wrap gap-4 items-center'>
              <AIGeneratingBadge />
              <Button 
                size='sm' 
                variant='secondary' 
                onClick={() => toast.success('V5 System Verified', {
                  description: 'This toast uses the Glassmorphism system.'
                })}
              >
                Verify Toast
              </Button>
            </div>
          </div>

          <div className='space-y-6'>
            <h3 className='font-serif text-2xl border-b border-surface-border pb-4'>
              Interactive Surfaces
            </h3>
            <Glass interactive={true} className='p-6'>
              <h4 className='font-semibold mb-2'>Interactive Glass</h4>
              <p className='text-text-muted text-sm'>
                Hover to see elevation, glow, and border brighten effects.
              </p>
            </Glass>
          </div>
        </div>
      </Glass>
    </div>
  );
}