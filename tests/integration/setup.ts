import request from 'supertest';
import * as http from 'http';
import app from '@/src/app';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { RoleTypeEnum } from '../../src/modules/user/enums/role';
let token: string;

jest.mock('@/src/middlewares/check.auth', () => ({
  checkAuth: jest.fn((role: RoleTypeEnum) => (req: any, res:any, next:any) => {
    // Simulate the role-based check. In this case, if the role is ADMIN, call next()
    if (role === RoleTypeEnum.ADMIN) {
      next();  // Simulate authorized admin role
    } else {
      res.status(403).send('Forbidden');  // Simulate forbidden access for other roles
    }
  }),
}));
describe('API Endpoints', () => {
  let server: http.Server;

  beforeAll(() => {
    token = jwt.sign({ userId: 'test-user-id',  roles: ["ADMIN"] }, config.secret, { expiresIn: '1h' })
    // Optional: Start the server if it's not already running
    server = app.listen(3001); // Use a test port
  });

  afterAll((done) => {
    // Close the server after tests are complete
    server.close(done);
  });

  it('should return a 200 status for the root route', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
  });
});

export { token };