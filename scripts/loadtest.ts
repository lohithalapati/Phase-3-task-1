// scripts/loadtest.ts

import autocannon from 'autocannon';

interface LoadTestConfig {
  url: string;
  connections: number;
  duration: number;
  pipelining: number;
}

async function runLoadTest(config: LoadTestConfig): Promise<void> {
  console.log('Starting load test...');
  console.log('Target:', config.url);
  console.log('Connections:', config.connections);
  console.log('Duration:', config.duration, 'seconds');

  const result = await autocannon({
    url: config.url,
    connections: config.connections,
    duration: config.duration,
    pipelining: config.pipelining,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log('\n=== LOAD TEST RESULTS ===');
  console.log('Requests/sec:', result.requests.mean);
  console.log('Latency avg:', result.latency.mean, 'ms');
  console.log('Latency p99:', result.latency.p99, 'ms');
  console.log('Throughput:', result.throughput.mean, 'bytes/sec');
  console.log('Errors:', result.errors);
  console.log('Timeouts:', result.timeouts);

  // Pass/Fail criteria
  const passed = 
    result.requests.mean > 100 &&
    result.latency.p99 < 500 &&
    result.errors === 0;

  console.log('\nLoad test:', passed ? 'PASSED' : 'FAILED');
  
  if (!passed) {
    process.exit(1);
  }
}

runLoadTest({
  url: process.env.TEST_URL || 'http://localhost:3000/health',
  connections: 10,
  duration: 30,
  pipelining: 1
});
