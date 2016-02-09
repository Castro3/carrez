var http = require('http'),
    fs = require('fs');
var leboncoin = require('./js/leboncoin');
var ma = require('./js/meilleursagents');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = __dirname + '/views/';

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(path + 'index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

io.on('connection', function (socket) {
    socket.on('sending_link', function (msg) {
        var url = msg["message"];
        console.log('link received: ' + url);
        
        leboncoin.getdata(url, writeInformations);
    });
});

writeInformations = function (err, result) {
    var lbcprix = Math.round(result.prix / result.surface, 2);
    console.log("LeboncoinJson:");
    console.log(result);
    io.emit('send_informations', "Ville: " + result.city);
    io.emit('send_informations', "Code postal: " + result.cp);
    io.emit('send_informations', "Prix par m2: " + lbcprix + "euros");


    ma(result.city, result.cp, function (mares) {
        console.log("MeilleurAgentJson:");
        console.log(mares);
        var locprix = 0;
        if (result.type == "appartement") {
            io.emit('send_estimation', "Estimation des MeilleursAgents: " + mares.prix_appart + "euros");
            locprix = mares.prix_appart;
        } else {
            io.emit('send_estimation', "Estimation des MeilleursAgents: " + mares.prix_maison + "euros");
            locprix = mares.prix_maison;
        }

        if (locprix >= lbcprix) {
            io.emit('send_advice', "Ceci est une bonne affaire");
        } else {
            io.emit('send_advice', "Ceci est une mauvaise affaire");
        }
    })

}