import { createTestUser } from '../factories/user.factory';

export const authFixture = {
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  user: createTestUser(),
};
