var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');


/* GET home page. */
router.get('/', function(req, res, next) {
    var userid= req.query.uid,
        uid = req.query.uid;
    if (!userid) return next();
    userid = new Buffer(userid,'base64').toString();
    /*console.log(req.connection.remoteAddress);*/
    var ip = req.connection.remoteAddress;
    var segment = ip.split(".")[2];
    var side ;
    if (segment <= 95 && segment >= 64) {
        side = 1 //外网
    } else{
        side = 0; //内网
    }
    request('http://172.29.2.26:8080/gw/findMyGw.action?user_id=' + userid,function(error,response,body){
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
                res.setHeader('Set-Cookie','uid=' + uid );
                res.render('index', { title: '个人门户' ,data: data,page: 'index',userid: userid,sides: side});
            } catch(e){
                next(e);
            }
        } else{
            next(error);
        }
    });
});

module.exports = router;
