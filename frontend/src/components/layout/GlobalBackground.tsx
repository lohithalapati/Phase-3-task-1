import { NeuralNetwork } from './NeuralNetwork';
/**
 * @purpose The GlobalBackground is the cinematic canvas for the entire application, establishing the premium, AI-native aesthetic.
 * @notes It combines a base gradient, an animated aurora, a subtle grid, the NeuralNetwork 'Brand Fingerprint', and a noise texture.
 */
export function GlobalBackground() {
  return (
    <div className='fixed inset-0 -z-50 h-full w-full bg-background-primary overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-background-primary via-[#0a0d18] to-background-secondary' />
      <div className='absolute inset-0 animate-aurora' style={{
        backgroundImage: 'radial-gradient(ellipse 800px 500px at 40% 30%, rgba(37, 99, 235, 0.15), transparent), radial-gradient(ellipse 600px 400px at 70% 60%, rgba(6, 182, 212, 0.1), transparent)',
      }} />
      <NeuralNetwork />
      <div className='absolute inset-0 bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPjwhLS0gR2VuZXJhdGVkIGJ5IGh0dHBzOi8vd3d3LmhlaXJvL3BhdHRlcm5zLyAtLT48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSI+PGZlVHVyYnVsZW5jZSBmaWx0ZXJSZXNQbGFjZW1lbnQ9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjgyIiBudW1PY3RhdmVzPSIzIiByZXN1bHQ9Im5vaXNlIiAvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwMCIgaGVpZht0PSIxMDAwIiBmaWxsPSJ3aGl0ZSIgLz48cmVjdCB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIxMDAwIiBmaWx0ZXI9InVybCgjbG9pc2UpIiBvcGFjaXR5PSIwLjAyIiAvPjwvc3ZnPg==)] opacity-50' />
    </div>
  );
}
