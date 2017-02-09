var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/',function(req,res,next){
    try{
        res.render('phone',{'title': '通讯录'});
    } catch(e){
        next(e);
    }
});

module.exports = router;