const request = require('supertest');
const { Customer } = require('../../models/customers');

let server;
describe('/api/customers', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await Customer.deleteMany({});
    await server.close();
  });

  describe('GET /', () => {
    it('should return all the customers', async () => {
      const customers = [
        { name: 'customer1', phone: '1234567890' },
        { name: 'customer2', phone: '0123456789' },
      ];

      await Customer.insertMany(customers);

      const res = await request(server).get('/api/customers/');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === 'customer1')).toBeTruthy();
      expect(res.body.some((c) => c.name === 'customer2')).toBeTruthy();
    });
  });
});
