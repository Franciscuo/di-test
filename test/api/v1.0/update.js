process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../src/app');
const conn = require('../../../src/database/config');

describe('v1 PUT /items', () => {
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

    it('FAIL, update wrong id item works', (done) => {
        request(app).put('/api_v1/editarItem')
            .send({
                "itemId": "0000@$%&",

                "item": {
                    "name": "Papas Fritas",
                    "brand": "Margarita",
                    "stock": 100,
                    "price": 500
                }
            })
            .then((res) => {
                const body = res.body;
                expect(body.error.error).to.equal(true);
                expect(body.error.message).to.equal('Id invalid');
                done();
            })
            .catch((err) => done(err));
    });


    it('FAIL, update without item name works', (done) => {
        request(app).post('/api_v1/agregarItem')
            .send({
                "item": {
                    "name": "Tortillas",
                    "brand": "Bimbo",
                    "stock": 10,
                    "price": 1000
                }
            })
            .then((res) => {
                request(app).get('/api_v1/todosItem')
                    .then((res) => {
                        const id = res.body.data[0]._id;
                        request(app).put('/api_v1/editarItem')
                            .send({
                                "itemId": id,

                                "item": {
                                    "name": "",
                                    "brand": "Margarita",
                                    "stock": 100,
                                    "price": 500
                                }
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


    it('FAIL, update without item brand works', (done) => {
        request(app).get('/api_v1/todosItem')
            .then((res) => {
                const id = res.body.data[0]._id;
                request(app).put('/api_v1/editarItem')
                    .send({
                        "itemId": id,

                        "item": {
                            "name": "Doria",
                            "brand": "",
                            "stock": 100,
                            "price": 500
                        }
                    })
                    .then((res) => {
                        const body = res.body;
                        expect(body.error).to.contain.property('error');
                        expect(body.error.error).to.equal(true);
                        expect(body.error.message).to.equal('Wrong data');
                        done();
                    })
            })
            .catch((err) => done(err));
    });


    it('FAIL, update without item stock works', (done) => {
        request(app).get('/api_v1/todosItem')
            .then((res) => {
                const id = res.body.data[0]._id;
                request(app).put('/api_v1/editarItem')
                    .send({
                        "itemId": id,

                        "item": {
                            "name": "Doria",
                            "brand": "",
                            "stock": null,
                            "price": 500
                        }
                    })
                    .then((res) => {
                        const body = res.body;
                        expect(body.error).to.contain.property('error');
                        expect(body.error.error).to.equal(true);
                        expect(body.error.message).to.equal('Wrong data');
                        done();
                    })
            })
            .catch((err) => done(err));
    });


    it('FAIL, update without item price works', (done) => {
        request(app).get('/api_v1/todosItem')
            .then((res) => {
                const id = res.body.data[0]._id;
                request(app).put('/api_v1/editarItem')
                    .send({
                        "itemId": id,

                        "item": {
                            "name": "Doria",
                            "brand": "",
                            "stock": 100,
                            "price": null
                        }
                    })
                    .then((res) => {
                        const body = res.body;
                        expect(body.error).to.contain.property('error');
                        expect(body.error.error).to.equal(true);
                        expect(body.error.message).to.equal('Wrong data');
                        done();
                    })
            })
            .catch((err) => done(err));
    });



})