export interface TestUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin@neuralhandoff.local',
    name: 'NeuralHandoff Admin',
    roles: ['admin'],
    permissions: ['*'],
    ...overrides,
  };
}
