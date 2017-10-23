var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');

router.get('/',function(req,res,next){
    res.render('flight',{'title': '机票查询','page': 'flight'});
});

module.exports = router;
