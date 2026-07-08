import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { TextArea } from '@/components/forms/TextArea';
import { Card } from '@/components/data/Card';
import { Badge } from '@/components/data/Badge';
import { Avatar } from '@/components/data/Avatar';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Spinner } from '@/components/feedback/Spinner';
import { PromptCard } from '@/components/ai/PromptCard';
import { ConfidenceBadge } from '@/components/ai/ConfidenceBadge';
import { Glass } from '@/components/ui/Glass';
import { toast } from 'sonner';

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen">
      <Container className="py-24 space-y-24">
        {/* Hero */}
        <Section>
          <h1 className="font-serif text-6xl font-bold bg-gradient-to-r from-primary-neural via-primary-cyan to-secondary-purple bg-clip-text text-transparent mb-4">
            NeuralHandoff V5
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Enterprise-grade design system. Cohesive, scalable, premium.
          </p>
        </Section>

        {/* Color Palette */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Neural Blue', color: '#3B82F6' },
              { name: 'Neural Cyan', color: '#06B6D4' },
              { name: 'AI Purple', color: '#8B5CF6' },
              { name: 'Aurora Violet', color: '#A855F7' },
              { name: 'Success', color: '#10B981' },
              { name: 'Warning', color: '#F59E0B' },
              { name: 'Error', color: '#EF4444' },
              { name: 'Background', color: '#050816' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="w-full h-20 rounded-lg border border-surface-border" style={{ backgroundColor: item.color }} />
                <p className="text-xs text-text-muted">{item.name}</p>
                <p className="text-xs font-mono text-text-subtle">{item.color}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Typography</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-text-muted mb-2">Heading (Serif)</p>
              <h3 className="font-serif text-4xl font-bold text-text-primary">The quick brown fox jumps over the lazy dog</h3>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2">Body (Sans)</p>
              <p className="text-lg text-text-primary">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2">Code (Mono)</p>
              <code className="font-mono text-base text-primary-neural">const design = 'enterprise'</code>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Buttons</h2>
          <div className="grid gap-4">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-text-secondary">Primary</p>
              <div className="flex flex-wrap gap-3">
                <Button>Button</Button>
                <Button disabled>Disabled</Button>
                <Button onClick={() => toast.success('Clicked!')}>With Toast</Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-text-secondary">Secondary</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-text-secondary">Other Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-text-secondary">Sizes</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Forms */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Forms</h2>
          <div className="max-w-md space-y-6">
            <Input label="Email Address" placeholder="name@company.com" type="email" />
            <Input label="With Error" placeholder="Your input" error="This field is required" />
            <TextArea label="Message" placeholder="Enter your message here..." />
          </div>
        </Section>

        {/* Cards & Data */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Cards & Data Display</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              header={<h3 className="font-semibold text-text-primary">Card Title</h3>}
              interactive
            >
              <p className="text-text-secondary">This is a card with a header, content, and glassmorphism effect.</p>
              <div className="flex gap-2 pt-4">
                <Badge variant="primary">Design</Badge>
                <Badge variant="secondary">System</Badge>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">With Avatar</h3>
                <div className="flex items-center gap-4">
                  <Avatar initials="AJ" variant="primary" />
                  <div>
                    <p className="font-semibold text-text-primary">Alex Johnson</p>
                    <p className="text-sm text-text-muted">Product Designer</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* AI Components */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">AI Components</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <PromptCard
              title="Analyze Document"
              description="Quickly extract insights from any document"
              category="Analysis"
              usage={1242}
            />
            <PromptCard
              title="Generate Report"
              description="Create comprehensive reports from raw data"
              category="Reports"
              usage={892}
            />
          </div>
          <Glass className="p-6 space-y-4">
            <h3 className="font-semibold text-text-primary">Confidence Score</h3>
            <ConfidenceBadge score={92} />
          </Glass>
        </Section>

        {/* Feedback */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Feedback Components</h2>
          <div className="grid gap-6">
            <div>
              <p className="text-sm font-semibold text-text-secondary mb-4">Skeleton Loaders</p>
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-text-secondary mb-4">Spinner</p>
              <div className="flex gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
            </div>
          </div>
        </Section>

        {/* Glassmorphism */}
        <Section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-text-primary">Glassmorphism Surfaces</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Glass variant="surface" className="p-6 space-y-2">
              <p className="text-xs text-text-muted">Surface</p>
              <p className="text-sm text-text-primary">Glass Surface</p>
            </Glass>
            <Glass variant="card" className="p-6 space-y-2">
              <p className="text-xs text-text-muted">Surface</p>
              <p className="text-sm text-text-primary">Card Surface</p>
            </Glass>
            <Glass variant="overlay" className="p-6 space-y-2">
              <p className="text-xs text-text-muted">Surface</p>
              <p className="text-sm text-text-primary">Overlay Surface</p>
            </Glass>
          </div>
        </Section>

        {/* Closing */}
        <Section className="text-center space-y-4 border-t border-surface-border pt-12">
          <p className="text-text-muted">Phase 2: Design System Complete</p>
          <p className="font-semibold text-text-primary">Ready for Phase 3: Core Pages</p>
        </Section>
      </Container>
    </div>
  );
}
