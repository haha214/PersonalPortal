var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');


/* GET home page. */
router.get('/', function(req, res, next) {
    var userid = '310000';
    request('http://172.29.2.25:8080/gw/findMyGw.action?user_id=' + userid,function(error,response,body){
        if (!error && response.statusCode == 200) {
            try{
                var result = JSON.parse(body);
                var data = {
                    pubsyms : [],
                    persyms: []
                };
                result.forEach(function(el,index,arr){
                    if (el.gw_type == 1) {   //系统项
                        data.pubsyms.push(el);
                    } else{   //个人项
                        data.persyms.push(el);
                    }
                });
                //console.log(data);
                res.render('index', { title: '个人门户' ,data: data,banner: true});
            } catch(e){
                next(e);
            }
        }
    });
});

module.exports = router;
