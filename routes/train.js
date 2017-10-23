var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');
var https = require('https');
var iconv = require("iconv-lite");
var zlib = require('zlib');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('train', { title: '火车票查询' ,'page' : 'train'});
});

// router.get('/login', function(req, res, next) {
//     var options = {
//         host: "kyfw.12306.cn",
//         path: '/otn/login/init',
//         method : 'get',
//         rejectUnauthorized: false ,
//         headers: {
//             "Content-Type" : "text/html;charset=utf-8",
//             "Connection":"Keep-Alive", 
//             "User-Agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
//             "Host" : "kyfw.12306.cn",
//             "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
//             "Accept-Language" : "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
//             "Accept-Encoding" : "gzip, deflate, br",
//             "Referer" :　"https://kyfw.12306.cn/otn/regist/init",
//             "Upgrade-Insecure-Requests" : "1"
//         }
//     };
//     https.get(options,function(response){
//         var headers = response.headers;
//         cookies = headers['set-cookie'];
//         cookies.forEach(function(cookie){
//             console.log(cookie);
//         });
//         var option = {
//             host: "kyfw.12306.cn",
//             path: '/otn/passcodeNew/getPassCodeNew?module=login&rand=sjrand',
//             method : 'get',
//             rejectUnauthorized: false ,
//             headers : {
//                 'Cookie' : cookies
//             }
//         };
//         https.get(option,function(imgrep){
//             var datas = [],
//                 size = 0;
//             imgrep.on('data',function(data){
//                 datas.push(data);
//                 size += data.length;
//                 //process.stdout.write(data);
//             });
//             imgrep.on('end',function(){
//                 var buff = Buffer.concat(datas,size);
//                 var result = 'data:image/jpeg;base64,' + buff.toString('base64');
//                 //console.log(result);
//                 res.setHeader('Set-Cookie',cookies);
//                 res.render('tLogin', { title: '火车票登陆' ,image: result});
//             });
//         })
//     })
// });

module.exports = router;