const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/users');

let server;

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await Genre.deleteMany({}); // Clean up the docs created in exec() func.
    await server.close();
  });

  let token;

  const exec = () =>
    request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401, if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400, if token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200, if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(201);
  });
});

describe('/api/auth/', () => {
  let email;
  let password;
  let server;
  let user;

  beforeEach(async () => {
    server = require('../../index');

    email = 'dummy@email.com';
    password = '123456789101112';

    user = new User({
      name: 'John',
      email,
      password,
    });

    await user.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  const exec = () =>
    // let the caller of this func await for it's result.
    request(server).post('/api/auth').send({ email, password });

  it('should return 400, if a valid email address is not provided', async () => {
    email = '';

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 400, if no password is not provided', async () => {
    password = '';

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 400, if user is not registered', async () => {
    email = 'not.registered@email.com';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400, if non-matching password is passed', async () => {
    password = 'incorrect_password';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return a valid token', async () => {
    const res = await exec();

    expect(res.body).toBeDefined();
  });
});
