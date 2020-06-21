process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../src/app');
const conn = require('../../../src/database/config');

describe('v1.1 GET /items', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })

    it('OK, getting items has no items', (done) => {
        request(app).get('/api_v1_1/todosItem')
            .then((res) => {
                const data = res.body.data;
                expect(data.length).to.equal(0);
                done();
            })
            .catch((err) => done(err));
    });
})