process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../src/app');
const conn = require('../../../src/database/config');


describe('v1.1 POST /addItem', () => {
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

    it('OK, creating a new item works', (done) => {
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
                const body = res.body;
                expect(body).to.contain.property('error');
                expect(body).to.contain.property('data');

                expect(body.error).to.equal('');
                const data = res.body.data;
                expect(data).to.contain.property('name');
                expect(data).to.contain.property('brand');
                expect(data).to.contain.property('stock');
                expect(data).to.contain.property('price');
                done();
            })
            .catch((err) => done(err));
    });

    it('OK, getting items has correct item', (done) => {
        request(app).get('/api_v1_1/todosItem')
            .then((res) => {
                const data = res.body.data;
                expect(data.length).to.equal(1);

                expect(data[0].name).to.equal('Tortillas');
                expect(data[0].brand).to.equal('Bimbo');
                expect(data[0].stock).to.equal(10);
                expect(data[0].price).to.equal(1000);
                done();
            })
            .catch((err) => done(err));
    });


    it('FAIL, item requires name', (done) => {
        request(app).post('/api_v1_1/agregarItem')
            .send({
                "item": {
                    "brand": "Bimbo",
                    "stock": 10,
                    "price": 1000
                }
            })
            .then((res) => {
                const body = res.body;
                expect(body.error.error)
                    .to.equal(true)
                done();
            })
            .catch((err) => done(err));
    });

    it('FAIL, item requires brand', (done) => {
        request(app).post('/api_v1_1/agregarItem')
            .send({
                "item": {
                    "name": "Mantequilla",
                    "stock": 10,
                    "price": 1000
                }
            })
            .then((res) => {
                const body = res.body;
                expect(body.error.error)
                    .to.equal(true)
                done();
            })
            .catch((err) => done(err));
    });

    it('FAIL, item requires price', (done) => {
        request(app).post('/api_v1_1/agregarItem')
            .send({
                "item": {
                    "name": "Mantequilla",
                    "brand": "Alpina",
                    "stock": 10
                }
            })
            .then((res) => {
                const body = res.body;
                expect(body.error.error)
                    .to.equal(true)
                done();
            })
            .catch((err) => done(err));
    });

    it('OK, item do not requires stock', (done) => {
        request(app).post('/api_v1_1/agregarItem')
            .send({
                "item": {
                    "name": "Mantequilla",
                    "brand": "Alpina",
                    "price": 1000
                }
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('error');
                expect(body).to.contain.property('data');

                expect(body.error).to.equal('');
                const data = res.body.data;
                expect(data).to.contain.property('name');
                expect(data).to.contain.property('brand');
                expect(data).to.contain.property('stock');
                expect(data).to.contain.property('price');

                expect(data.stock).to.equal(0);
                done();
            })
            .catch((err) => done(err));
    });
})