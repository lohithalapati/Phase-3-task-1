export const MOCK_USER = {
  id: "usr_99218204",
  email: "admin@neuralhandoff.io",
  firstName: "Jane",
  lastName: "Doe",
  role: "Principal Engineer",
  department: "Platform Infrastructure",
  permissions: ["*"]
};

export const MOCK_PROJECTS = [
  {
    id: "proj_01",
    name: "Enterprise Core Integration",
    status: "active",
    teamMembers: 12,
    completionRate: 84.5,
    lastActivity: "2023-11-20T14:22:00Z"
  },
  {
    id: "proj_02",
    name: "Autonomous System Handoff Engine",
    status: "review",
    teamMembers: 6,
    completionRate: 100.0,
    lastActivity: "2023-11-19T09:11:00Z"
  }
];

export const MOCK_DASHBOARD_METRICS = {
  activeHandoffs: 34,
  completionRate: 98.7,
  meanTimeToTransferMinutes: 4.2,
  systemUptimePercentage: 99.995,
  latencyTrendMs: [120, 115, 125, 110, 105, 108, 102]
};

export const MOCK_AI_TRANSCRIPTION = {
  text: "Initializing dynamic microservice transfer across availability zones. Primary configuration complete.",
  durationMs: 450,
  confidence: 0.982
};