var express = require('express');
var router = express.Router();
var connection = require('../library/database');

router.get('/detailItem/:idData', function(req, res, next) {
    let idData = req.params.idData

    connection.query(`SELECT * FROM item WHERE id = ${idData}`, function(error, result) {
        if(error) {
            req.flash('Error', error);
            res.redirect('/')
          } else {
            res.render('detailItem', { data: result })
          }
    })
})

module.exports = router