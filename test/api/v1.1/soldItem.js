process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../src/app');
const conn = require('../../../src/database/config');

describe('v1.1 soldItem /items', () => {
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

    it('OK, change stock works', (done) => {
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
                        request(app).put('/api_v1_1/soldStock')
                            .send({
                                "itemId": id,
                                "sold": 3
                            })
                            .then((res) => {
                                const stock = res.body.data.stock;
                                expect(stock).to.equal(7);
                                done();
                            })
                    })
            })
            .catch((err) => done(err));
    });


    it('FAIL, change stock without sold works', (done) => {
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
                        request(app).put('/api_v1_1/soldStock')
                            .send({
                                "itemId": id,
                                "sold": null
                            })
                            .then((res) => {
                                const body = res.body;
                                expect(body.error).to.contain.property('error');
                                expect(body.error.error).to.equal(true);
                                expect(body.error.message).to.equal('Wrong data');
                                done();
                            })
                    })
            })
            .catch((err) => done(err));
    });


    it('FAIL, change stock without id works', (done) => {
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
                        request(app).put('/api_v1_1/soldStock')
                            .send({
                                "itemId": null,
                                "sold": 4
                            })
                            .then((res) => {
                                const body = res.body;
                                expect(body.error).to.contain.property('error');
                                expect(body.error.error).to.equal(true);
                                expect(body.error.message).to.equal('Id invalid');
                                done();
                            })
                    })
            })
            .catch((err) => done(err));
    });

    it('FAIL, change stock wrong id works', (done) => {
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
                        request(app).put('/api_v1_1/soldStock')
                            .send({
                                "itemId": '234as5d6f70',
                                "sold": 4
                            })
                            .then((res) => {
                                const body = res.body;
                                expect(body.error).to.contain.property('error');
                                expect(body.error.error).to.equal(true);
                                expect(body.error.message).to.equal('Id invalid');
                                done();
                            })
                    })
            })
            .catch((err) => done(err));
    });


    it('FAIL, change stock soldout', (done) => {
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
                        request(app).put('/api_v1_1/soldStock')
                            .send({
                                "itemId": id,
                                "sold": 40
                            })
                            .then((res) => {
                                const body = res.body;
                                expect(body.error).to.contain.property('error');
                                expect(body.error.error).to.equal(true);
                                expect(body.error.message).to.equal('Not enough stock');
                                done();
                            })
                    })
            })
            .catch((err) => done(err));
    });

});