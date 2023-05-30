const request = require('supertest');
const app = require('./index.js'); // replace with path to your Express.js app
const { UserModel, CatModel } = require('./models/model'); // replace with path to your user model

describe('POST /user/register', () => {
    const existingUser = { username: 'existinguser', password: 'Existing123' };
    const newUser = { username: 'k5089898', password: 'Kk61561690' };
    const wrongformatuser = { username: 'test', password: 'test' };
    beforeAll(async () => {
        await UserModel.deleteMany({});
        await UserModel.create(existingUser);
    });

    describe('user alreay exists', () => {
        it('returns an error if username already exists', async () => {
            const res = await request(app).post('/api/user/register').send(existingUser);
            expect(res.statusCode).toBe(400);
        });
    });
    describe('wrong format', () => {
        it('returns an error if the format does not match the requirement', async () => {
            const res = await request(app).post('/api/user/register').send(wrongformatuser);
            expect(res.statusCode).toBe(400);
        });
    });

    describe('user register', () => {
        it('should response 200', async () => {
            const res = await request(app).post('/api/user/register').send(newUser);
            expect(res.statusCode).toBe(200);
        });
    });
});
describe('POST /user/login', () => {
    describe('user login', () => {
        it('should response 200', async () => {
            const res = await request(app).post('/api/user/login').send({
                username: 'k5089898',
                password: 'Kk61561690',
            });
            expect(res.statusCode).toBe(200);
        });
    });
});
describe('GET /cats/list', () => {
    it('should response 200', async () => {
        const res = await request(app).get('/api/cat/list');
        expect(res.statusCode).toBe(200);
    });
});
describe('POST /cats/insert', () => {
    const staff = { username: 'k50898982', password: 'Kk61561690', isStaff: true };

    beforeAll(async () => {
        await UserModel.deleteMany({});
        await UserModel.create(staff);
        const response = await request(app).post('/api/user/login').send({
            username: staff.username,
            password: staff.password,
        });

        token = response.body.data.token;
    });
    it('insert a new information of cat', async () => {
        const res = await request(app).post('/api/cat/insert').set('Authorization', `Bearer ${token}`).send({
            name: 'snow',
            breeds: 'test 2',
            age: 3,
            gender: 'girl',
        });
        expect(res.statusCode).toBe(200);
    });
});
describe('PUT /cats/update', () => {
    const staff = { username: 'k50898982', password: 'Kk61561690', isStaff: true };
    beforeAll(async () => {
        await UserModel.deleteMany({});
        await UserModel.create(staff);
        const response = await request(app).post('/api/user/login').send({
            username: staff.username,
            password: staff.password,
        });
        const res = await request(app).get('/api/cat/list');
        token = response.body.data.token;
        id = res.body[0]._id;
    });
    describe('update cat information', () => {
        it('should return 200', async () => {
            const res = await request(app).put(`/api/cat/update/${id}`).set('Authorization', `Bearer ${token}`).send({
                name: 'snow edited',
                breeds: 'test 2',
                age: 3,
                gender: 'girl',
            });
            expect(res.statusCode).toBe(200);
        });
    });
    describe('when id is wrong', () => {
        it('should return 400', async () => {
            const res = await request(app)
                .put(`/api/cat/update/${id}abc`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'snow edited',
                    breeds: 'test 2',
                    age: 3,
                    gender: 'girl',
                });
            expect(res.statusCode).toBe(400);
        });
    });
    describe('when user is not staff', () => {
        it('should return 401', async () => {
            const res = await request(app)
                .put(`/api/cat/update/${id}`)
                .set('Authorization', `Bearer ${token}abc`)
                .send({
                    name: 'snow edited',
                    breeds: 'test 2',
                    age: 3,
                    gender: 'girl',
                });
            expect(res.statusCode).toBe(401);
        });
    });
});
describe('DELETE /cats/delete', () => {
    const staff = { username: 'k50898982', password: 'Kk61561690', isStaff: true };
    beforeAll(async () => {
        await UserModel.deleteMany({});
        await UserModel.create(staff);
        const response = await request(app).post('/api/user/login').send({
            username: staff.username,
            password: staff.password,
        });
        const res = await request(app).get('/api/cat/list');
        token = response.body.data.token;
        id = res.body[0]._id;
    });
    describe('delete cat from data', () => {
        it('should return 200', async () => {
            const res = await request(app).delete(`/api/cat/delete`).set('Authorization', `Bearer ${token}`).send({
                id: id,
            });
            expect(res.statusCode).toBe(200);
        });
    });
    describe('when id is wrong', () => {
        it('should return 400', async () => {
            const res = await request(app)
                .put(`/api/cat/update/${id}abc`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'snow edited',
                    breeds: 'test 2',
                    age: 3,
                    gender: 'girl',
                });
            expect(res.statusCode).toBe(400);
        });
    });
    describe('when user is not staff', () => {
        it('should return 401', async () => {
            const res = await request(app)
                .put(`/api/cat/update/${id}`)
                .set('Authorization', `Bearer ${token}abc`)
                .send({
                    name: 'snow edited',
                    breeds: 'test 2',
                    age: 3,
                    gender: 'girl',
                });
            expect(res.statusCode).toBe(401);
        });
    });
});
