const { Router } = require('express');
const router = Router();

const itemCtrl = require('../controllers/items');
const response = require('./response');


//Route for add Items to store
router.post('/agregarItem', (req, res) => {
    try {
        const { name, brand, stock, price } = req.body.item;
        itemCtrl.addItem(name, brand, stock, price)
            .then((info) => {
                response.success(res, info, 200)
            })
            .catch((e) => {
                response.error(res, e, 400)
            })
    } catch (e) {
        response.error(res, e, 500)
    }
});

//Route to see items in the store
router.get('/todosItem', (req, res) => {
    try {
        itemCtrl.listItems()
            .then((info) => {
                response.success(res, info, 200)
            })
            .catch((e) => {
                response.error(res, e, 400)
            })
    } catch (e) {
        response.error(res, e, 500)
    }

});

//Route to delete items 
router.delete('/eliminarItem', (req, res) => {
    try {
        const id = req.body.itemId;
        itemCtrl.deleteItem(id)
            .then((info) => {
                response.success(res, info, 200)
            })
            .catch((e) => {
                response.error(res, e, 400)
            })
    } catch (e) {
        response.error(res, e, 500)
    }
});

//Route to update items 
router.put('/editarItem', (req, res) => {
    try {
        const { name, brand, stock, price } = req.body.item;
        const id = req.body.itemId;
        itemCtrl.editItem(id, name, brand, stock, price)
            .then((info) => {
                response.success(res, info, 200)
            })
            .catch((e) => {
                response.error(res, e, 400)
            })
    } catch (e) {
        response.error(res, e, 500)
    }
});

module.exports = router;