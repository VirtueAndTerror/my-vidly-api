const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/users');

let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  // afterAll(() => {
  //   server.close();
  // });

  describe('GET /', () => {
    it('should return all genres', async () => {
      const genres = [{ name: 'genre1' }, { name: 'genre2' }];

      const docs = await Genre.collection.insertMany(genres);

      console.log('Docs:', docs);

      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((genre) => genre.name === 'genre1')).toBeTruthy();
      expect(res.body.some((genre) => genre.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre, if valid ID is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return a 404, if invalid ID is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('should return a 404, if no genre with the give ID exists', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    /* Define the happy path, and then, we change one parameter,
        that clearly alings with the name of the test */
    let token;
    let name;

    const exec = async () =>
      await request(server)
        .post('/api/genres')
        .set('x-auth-token', token) // 'x-auth-token' is the name that our authentication middleware looks for.
        .send({ name });

    beforeEach(() => {
      // In this func, we set the value for the 'happy path'

      token = new User().generateAuthToken(); // Remember: We will be logged in by default
      name = 'genre1';
    });

    it('should return a 401, if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return a 400, if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return a 400, if genre is more than 50 characters', async () => {
      name = new Array(52).join('a'); // 51 characters Array

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre, if its valid', async () => {
      const res = await exec();

      const genre = await Genre.find({ name: 'genre1' });

      expect(res.status).toBe(201);
      expect(genre).not.toBeNull();
    });

    it('should return the genre, if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    let token;
    let name;

    beforeEach(() => {
      // Remember: We will be logged in by default
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    it('should return 400, if invalid genre name is passed', async () => {
      name = '@';

      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name });

      expect(res.status).toBe(400);
    });

    it('should return 404, if the genre with the given ID is not found', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();

      const res = await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name });

      expect(res.status).toBe(404);
    });

    it('should return the updated genre, if valid genre is passed', async () => {
      const genre = new Genre({ name });
      await genre.save();

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name });

      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let genre;
    let id;

    const exec = async () =>
      await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: 'genre1', isAdmin: true });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it('should return 401, if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 404, if genre with a given id is not found', async () => {
      id = new mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should delete the genre, if input is valid', async () => {
      await exec();

      const genreInDB = await Genre.findById(id);

      expect(genreInDB).toBeNull();
    });

    it('should return the deleted genre', async () => {
      const res = await exec();

      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });
});
