var express = require('express');
var router = express.Router();
var request = require('request');
var https = require("https"); 
var iconv = require("iconv-lite");
var config = require('../config/config');
var xss = require('xss');

/* GET users listing. */
router.get('/:method', function(req, res, next) {
    var data = {};
    switch(req.params.method) {
        case 'getWeather':
            var city = encodeURIComponent(xss(req.query.city));
            request(config.server + '/api/getWeather?city=' + city, function(error, response, body) {
                res.header('Content-type', 'application/json');
                res.header('Charset', 'utf8');
                try {
                    if(!error && response.statusCode == 200) {
                        //console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
                        return res.send(JSON.parse(body));
                    } 
                    throw error;
                } catch(e) {
                    res.send({
                        success: 0,
                        msg: '服务器异常'
                    });
                }
            });
            break;
        case 'getTrainDate':
            var date = req.query.date,
                from_station = req.query.from_station,
                to_station = req.query.to_station,
                purpose_codes = req.query.purpose_codes,
                url = '/otn/leftTicket/query?leftTicketDTO.train_date=' + date + '&leftTicketDTO.from_station=' + from_station + '&leftTicketDTO.to_station=' + to_station + '&purpose_codes=' + purpose_codes;
                //console.log(url);
                var options = {
                    hostname : 'kyfw.12306.cn',
                    path: url,
                    rejectUnauthorized: false  // 忽略安全警告
                }
                https.get(options,function(response){
                    var datas = [],
                        size = 0;
                    response.on('data',function(data){
                        datas.push(data);
                        size += data.length;
                        //process.stdout.write(data);
                    });
                    response.on('end',function(){
                        var buff = Buffer.concat(datas,size);
                        var result = iconv.decode(buff,'utf8');
                        console.log(result);
                        res.send(result);
                    });
                }).on('error',function(e){
                    res.send({
                        httpstatus: 500,
                        messages: ['服务器异常']
                    });
                });
            break;
            //途牛火车票接口
        case 'getTNTrainDate':
                var date = req.query.date,
                    from_station = encodeURIComponent(req.query.from_station),
                    to_station = encodeURIComponent(req.query.to_station);
                request(config.server + '/api/getTNTrainDate?date=' + date + '&from_station=' + from_station + '&to_station=' + to_station,function(error,response,body){
                    res.header('Content-type', 'application/json');
                    res.header('Charset', 'utf8');
                    try {
                        if(!error && response.statusCode == 200) {
                            //console.log(JSON.parse(body).data.list); // Show the HTML for the Google homepage. 
                            return res.send(body);
                        } 
                        throw error;
                    } catch(e) {
                        console.log(e);
                        res.send({
                            code: 500,
                            msg: '服务器异常'
                        });
                    }
                });
            break;
        //获取机票信息
        // case 'getFlightData' :
        //     var orgCityCode = req.query.orgCityCode,
        //         dstCityCode = req.query.dstCityCode,
        //         departureDate = req.query.date;
        //         request('https://flight-api.tuniu.com/query/queryTickets/category?callback=&{orgCityCode:'+ orgCityCode +',dstCityCode:'+ dstCityCode +',departureDate:"'+ departureDate +'"}', function(error, response, body) {
        //             res.header('Content-type', 'application/json');
        //             res.header('Charset', 'utf8');
        //             try {
        //                 if(!error && response.statusCode == 200) {
        //                     //console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
        //                     return res.send(JSON.parse(body));
        //                 } 
        //                 throw error;
        //             } catch(e) {
        //                 console.log(e);
        //                 res.send({
        //                     success: false,
        //                     msg: '服务器异常'
        //                 });
        //             }
        //         });
        //     break;
        case 'getFlightData' :
            var orgCityCode = req.query.orgCityCode,
                dstCityCode = req.query.dstCityCode,
                departureDate = req.query.date;
                request(config.server + '/api/getFlightData?orgCityCode=' + orgCityCode + '&dstCityCode=' + dstCityCode + '&date=' + departureDate, function(error, response, body) {
                    res.header('Content-type', 'application/json');
                    res.header('Charset', 'utf8');
                    try {
                        if(!error && response.statusCode == 200) {
                            //console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
                            return res.send(JSON.parse(body));
                        } 
                        throw error;
                    } catch(e) {
                        console.log(e);
                        res.send({
                            success: false,
                            msg: '服务器异常'
                        });
                    }
                });
            break;
        //添加模块
        case 'addMyGw' :
            var userid = req.query.userid,
                url  = encodeURIComponent(req.query.url),
                mark = encodeURIComponent(req.query.mark),
                type = req.query.type;
            request('http://172.29.2.26:8080/gw/addMyGw.action?user_id=' + userid +'&gw_URL='+ url +'&gw_mark=' + mark +'&gw_type=' + type,function(error,response,body){
                res.header('Content-type', 'application/json');
                res.header('Charset', 'utf8');
                try{
                    if(!error && response.statusCode == 200) {
                        //console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
                        return res.send(JSON.parse(body));
                    } 
                    throw error;
                } catch(e){
                    res.send({
                        ret: 505
                    });
                }
            });
            break;
        //删除模块
        case 'delMyGw' :
            var userid = req.query.userid,
                gwid = req.query.gwid;
            request('http://172.29.2.26:8080/gw/delMyGw.action?user_id=' + userid + '&id=' + gwid,function(error,response,body){
                res.header('Content-type', 'application/json');
                res.header('Charset', 'utf8');
                try{
                    if(!error && response.statusCode == 200) {
                        //console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
                        return res.send(JSON.parse(body));
                    } 
                    throw error;
                } catch(e){
                    res.send({
                        ret: 505
                    });
                }
            });
            break;
        //编辑模块
        case 'editMyGw' :
            var userid = req.query.userid,
                url  = encodeURIComponent(req.query.url),
                mark = encodeURIComponent(req.query.mark),
                type = req.query.type,
                gwid = req.query.gwid;
            request('http://172.29.2.26:8080/gw/updateMyGw.action?user_id=' + userid + '&id=' + gwid + '&gw_URL='+ url +'&gw_mark=' + mark +'&gw_type=' + type,function(error,response,body){
                res.header('Content-type', 'application/json');
                res.header('Charset', 'utf8');
                try{
                    if(!error && response.statusCode == 200) {
                        console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
                        return res.send(JSON.parse(body));
                    } 
                    throw error;
                } catch(e){
                    res.send({
                        ret: 505
                    });
                }
            });
            break;
        default:
            res.send('respond with a resource');
            break;
    }
});
router.post('/:method', function(req, res, next) {
    var data = {};
    switch(req.params.method) {
        //帖子置顶
        case 'stickyPost':
            request.post({
                url: config.server + '?service=Post.StickyPost',
                formData: {
                    user_id: userID,
                    post_id: req.body.post_id
                }
            }, function optionalCallback(err, httpResponse, body) {
                res.header('Content-type', 'application/json');
                res.header('Charset', 'utf8');
                try {
                    if(!err && httpResponse.statusCode == 200) {
                        return res.send(JSON.parse(body));
                    }
                    console.error('Sticky failed:', err);
                    res.send({
                        ret: 500,
                        msg: '服务器异常'
                    });
                } catch(e) {
                    res.send({
                        ret: 500,
                        msg: e.message
                    });
                }
            });
            break;
        default:
            res.send('respond with a resource');
            break;
    }

});
module.exports = router;