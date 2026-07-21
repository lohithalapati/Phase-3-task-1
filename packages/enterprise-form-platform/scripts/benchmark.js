const { performance } = require("perf_hooks");
const { loginSchemaV2 } = require("../dist/schemas/authSchemas");

console.log("\x1b[36m============================================================\x1b[0m");
console.log("\x1b[36m      SLA LATENCY BENCHMARK: SUB-5ms COMPUTATION CHECK      \x1b[0m");
console.log("\x1b[36m============================================================\x1b[0m");

const validPayload = {
  email: "performance@enterprise.io",
  password: "super_secure_password_long_string",
  mfaCode: "123456"
};

const iterations = 10000;
let totalTime = 0;

console.log(`Executing ${iterations.toLocaleString()} validations dynamically...`);

for (let i = 0; i < iterations; i++) {
  const start = performance.now();
  loginSchemaV2.safeParse(validPayload);
  const end = performance.now();
  totalTime += (end - start);
}

const avgLatency = totalTime / iterations;
console.log(`Total Processing Time: ${totalTime.toFixed(4)}ms`);
console.log(`Average Validation Latency: \x1b[32m${avgLatency.toFixed(6)}ms\x1b[0m per call`);

if (avgLatency < 5.0) {
  console.log("\x1b[32m[PASS] Validation Latency satisfies < 5ms SLA constraints.\x1b[0m");
} else {
  console.log("\x1b[31m[FAIL] SLA threshold breached!\x1b[0m");
  process.exit(1);
}
console.log("\x1b[36m============================================================\x1b[0m");
