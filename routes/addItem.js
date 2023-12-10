var express = require('express');
var router = express.Router();
var connection = require('../library/database');
var fileSystem = require('fs');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/addItem', function(req, res) {
    res.render('addItem', {
        id: '/store',
        name_item: '',
        cost: '',
        description: '',
        category: '',
        image: ''
    })
});

router.post('/store', upload.single('image'), function(req, res, next) {
    let nameItem = req.body.nameItem
    let cost = req.body.cost
    let description = req.body.description
    let category = req.body.category
    let image = req.file ? req.file.originalname : '';
    let errors = false

    if(nameItem.length === 0 || cost.length === 0 || category.length === 0 || description.length === 0 || image.length === 0) {
        errors = true
        req.flash('error', 'Invalid input data')
        res.render('addItem', {
            name_item: nameItem,
            cost: cost,
            description: description,
            category: category,
            image: image
        })
    }

    if(!errors) {
        let formData = {
            name_item: nameItem,
            cost: cost,
            description: description,
            category: category,
            image: image
        }
        connection.query('INSERT INTO item SET ?', formData, function(error, result) {
            if(error) {
                req.flash('error', error)
                res.render('addItem', {
                    name_item: formData.name_item,
                    cost: formData.cost,
                    description: formData.description,
                    category: formData.category,
                    image: formData.image
                })
            }else {
                req.flash('Success', 'Data Item succesfully');
                res.redirect('/')
            }
        })
    }
});

router.get('/editItem/:idData', function(req, res, next) {
    let idData = req.params.idData

    connection.query(`SELECT * FROM item WHERE id = ${idData}`, function(error, rows) {
        if(error) throw error

        if(req.length <= 0) {
            req.flash('Error', `Data dengan ID ${idData} tidak ditemukan`);
            res.redirect('/')
        } else {
            res.render('addItem', { 
                id: `/update/${idData}`,    
                name_item: rows[0].name_item,
                cost: rows[0].cost,
                description: rows[0].description,
                category: rows[0].category,
                image: rows[0].image
            });
        }
    });
});

router.post('/update/:idData', upload.single('image'), function(req, res, next) {
    let idData = req.params.idData
    let nameItem = req.body.nameItem
    let cost = req.body.cost
    let description = req.body.description
    let category = req.body.category
    let errors = false

    if (nameItem.length === 0 || cost.length === 0 || category.length === 0 || description.length === 0) {
        errors = true
        req.flash('error', 'Invalid input data')
        return res.render('addProduct', {
            name_item: nameitem,
            cost: cost,
            description: description,
            category: category,
        })
    }

    connection.query(`SELECT image FROM item WHERE id = ${idData}`, function(error, results) {
        if (error) {
            req.flash("error", error);
            return res.render("addProduct", {
                name_item: nameItem,
                cost: cost,
                description: description,
                category: category,
            });
        }

        let prevImage = results[0].image

        if (prevImage) {
            fileSystem.unlinkSync('public/images/' + prevImage);
        }

        let formData = {
            name_item: nameItem,
            cost: cost,
            description: description,
            category: category,
        }

        if (req.file) {
            formData.image = req.file.originalname
        }

        connection.query(`UPDATE item SET ? WHERE id = ${idData}`, formData, function(error, result) {
            if (error) {
                req.flash('error', error)
                return res.render('addProduct', {
                    name_item: formData.name_item,
                    cost: formData.cost,
                    description: formData.description,
                    category: formData.category,
                    image: formData.image
                })
            } else {
                req.flash('success', 'Product data has been updated');
                return res.redirect('/')
            }
        })
    })
});

module.exports = router