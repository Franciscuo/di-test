const mongoose = require('mongoose');
const Items = require('../../../database/models/items');

const itemCtrl = {};

itemCtrl.listItems = () => {
    try {
        return new Promise(async(resolve, reject) => {
            await Items.find()
                .then((items) => {
                    resolve(items);
                })
                .catch(e => {
                    console.log(e)
                    reject('Failed to read database');
                })
        })
    } catch (e) {
        return false;
    }
};

itemCtrl.addItem = (name, brand, stock, price) => {
    try {
        return new Promise(async(resolve, reject) => {
            if (!name || !brand || !price) {
                reject('Wrong data');
                return false
            }
            const newItem = new Items({
                name,
                brand,
                stock,
                price,
            });
            await newItem.save()
                .then((newItem) => {
                    resolve(newItem);
                })
                .catch(e => {
                    console.log(e)
                    reject('Failed to save to database');
                })

        })
    } catch (e) {
        return false;
    }
};

itemCtrl.deleteItem = (id) => {
    try {
        return new Promise(async(resolve, reject) => {
            if (id != null && id.length != 24) {
                return reject('Id invalid');
            }
            const ExprReg = /[A-Za-z0-9]+$/;
            if (!ExprReg.test(id)) {
                return reject('Id invalid');
            }
            item = await Items.findById(id);
            if (!item) {
                reject('Id invalid');

            } else {
                await Items.findByIdAndDelete(id)
                    .then((items) => {
                        resolve(items);
                    })
                    .catch(e => {
                        console.log(e)
                        reject('Failed to read database');
                    })
            }
        })
    } catch (e) {
        return false;
    }
};

itemCtrl.editItem = (id, name, brand, stock, price) => {
    try {
        return new Promise(async(resolve, reject) => {
            if (id != null && id.length != 24) {
                return reject('Id invalid');

            }
            const ExprReg = /[A-Za-z0-9]+$/;
            if (!ExprReg.test(id)) {
                return reject('Id invalid');
            }
            if (!name || !brand || !price || !stock) {
                return reject('Wrong data');
            }
            item = await Items.findById(id)
            if (!item) {
                reject('Id invalid');

            } else {
                item.name = name;
                item.brand = brand;
                item.stock = stock;
                item.price = price;
                await item.save()
                    .then((item) => {
                        resolve(item);
                    })
                    .catch(e => {
                        console.log(e)
                        reject('Failed to update database');
                    })
            }
        })
    } catch (e) {
        return false;
    }
};

module.exports = itemCtrl;