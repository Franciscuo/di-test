process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../src/app');
const conn = require('../../../src/database/config');

describe('v1.1 DELETE /items', () => {
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


    it('FAIL, delete wrong  lentgh item works', (done) => {
        request(app).del('/api_v1_1/eliminarItem')
            .send({
                "itemId": "0000"
            })
            .then((res) => {
                const body = res.body;
                expect(body.error.error).to.equal(true);
                expect(body.error.message).to.equal('Id invalid');
                done();
            })
            .catch((err) => done(err));
    });

    it('FAIL, delete wrong code item works', (done) => {
        request(app).del('/api_v1_1/eliminarItem')
            .send({
                "itemId": "12345678901234567890123@"
            })
            .then((res) => {
                const body = res.body;
                expect(body.error.error).to.equal(true);
                expect(body.error.message).to.equal('Id invalid');
                done();
            })
            .catch((err) => done(err));
    });

    it('OK, Delete an item works', (done) => {
        request(app).post('/api_v1_1/agregarItem')
            .send({
                "item": {
                    "name": "Tortillas",
                    "brand": "Bimbo",
                    "stock": 10,
                    "price": 1000
                }
            })
            .then((res) => {
                request(app).get('/api_v1_1/todosItem')
                    .then((res) => {
                        const id = res.body.data[0]._id;
                        request(app).del('/api_v1_1/eliminarItem')
                            .send({
                                "itemId": id
                            })
                            .then((res) => {
                                request(app).get('/api_v1_1/todosItem')
                                    .then((res) => {
                                        const data = res.body.data;
                                        expect(data.length).to.equal(0);
                                        done();
                                    })
                            })
                    })
            })
            .catch((err) => done(err));
    });

})