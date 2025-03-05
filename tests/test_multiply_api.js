import { app } from '../app';
import request from 'supertest';

describe('Test Multiply API', () => {
  it('should multiply two numbers', async () => {
    const response = await request(app).get('/multiply').query({ first: 2, second: 3 });
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(6);
  });
});
