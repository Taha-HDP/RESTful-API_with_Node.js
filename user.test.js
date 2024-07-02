const request = require('supertest');
const app = require('./app');
const auth = require('./app/http/middleware/auth');
describe('User API Endpoints', () => {
    it('should create a new user', async () => {
        const newUser = {
            username: 'John Doe',
            phone: '09121111111',
            password: 'Password123',
        };
        const response = await request(app)
            .post('/users')
            .send(newUser);
        expect(response.status).toBe(201);
    });
    it('should get all users', async () => {
        const response = await request(app)
            .get('/users')
            .set('x-auth-token', 'Bearer yourAccessToken'); 
        expect(response.status).toBe(200);
    });

    it('should get a user by ID', async () => {
        const userId = 'yourUserId';
        const response = await request(app)
            .get(`/users/${userId}`)
            .set('x-auth-token', 'Bearer yourAccessToken');
        expect(response.status).toBe(200);
    });

    it('should log in a user', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'testpassword',
        };
        const response = await request(app)
            .get('/login')
            .send(credentials);
        expect(response.status).toBe(200);
    });

    it('should edit an existing user', async () => {
        const userId = 'yourUserId';
        const updatedUser = {
            username: 'Updated username',
            address: 'updated address',
        };
        const response = await request(app)
            .put(`/users/${userId}`)
            .set('x-auth-token', 'Bearer yourAccessToken')
            .send(updatedUser);
        expect(response.status).toBe(200);
    });

    it('should delete a user', async () => {
        const userId = 'yourUserId';
        const response = await request(app)
            .delete(`/users/${userId}`)
            .set('x-auth-token', 'Bearer yourAccessToken');
        expect(response.status).toBe(204);
    });
});
