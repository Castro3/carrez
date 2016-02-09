var request = require('request');
var http = require('https');
var cheerio = require('cheerio');


module.exports = function (ville, cp, callback) {
    var nville = ville.toLowerCase();
    nville = nville.replace(/ /g, "-");
    request({
        uri: 'https://www.meilleursagents.com/prix-immobilier/' + nville + '-' + cp + '/#estimates',
        headers: {
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Host': 'www.meilleursagents.com',
            'Upgrade-Insecure-Requests': 1,
            'Cookie': 'deploy_dispatcher=39; LiwioReferrer=; hasConsent=true; remember_token=1383812|3b86905f6c6603e477ea217eb67df110b2714012; _gat=1; session=eyJfaWQiOiJiNTk0YThkYWNhYzExNTNiMzBjYzE1ZWE5YTI5ZGNjNiIsIl9mcmVzaCI6dHJ1ZSwiYW5hbHl0aWNzX3RhZ3MiOltdLCJ1c2VyX2lkIjoxMzgzODEyfQ.CZI2ng.t6pz5iSN6STZG6XB2fTB0dQsWJ0; _ga=GA1.2.594170919.1454414511; ABTastySession=LiwioHashMRASN%3Anull%5E%7C%5ELiwioUTMC%3A1; ABTasty=ABTastyUTMB%3A1%5E%7C%5ELiwioUTMA%3A0.1.1454414512716.0.1454414512716.16%5E%7C%5ELiwioTracking%3A16020213015295307%5E%7C%5EsegmentationTracking%3A16020213015295307; visitor_id62172=169244827'
        }
    }, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var appart = html.substring(html.indexOf('Prix m2 appartement :')+22, html.indexOf('€ / m² ;')-1);
            var maison = html.substring(html.indexOf('Prix m2 maison :')+17, html.indexOf('€ / m²,')-1);
            var text = "{\"prix_maison\":\""+maison+"\",\"prix_appart\":\""+appart+"\"}";
            var newJson = JSON.parse(text);
            callback(newJson);
        }
    });
}