var request = require('request');
var cheerio = require('cheerio');


module.exports = {
    getobj: function (url, obj, callback) {
        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                var text = $('script').text();

                var jsonTxt = (text.substring(text.indexOf('{'), text.indexOf('}') + 1));
                jsonTxt = jsonTxt.replace(/  /g, "\"");
                jsonTxt = jsonTxt.replace(/ :/g, "\":");
                var newJson = JSON.parse(jsonTxt);

                callback(null, newJson[obj]);
            }
        });
    },
    getdata:function (url, callback) {
        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                var text = $('script').text();

                var jsonTxt = (text.substring(text.indexOf('{'), text.indexOf('}') + 1));
                jsonTxt = jsonTxt.replace(/  /g, "\"");
                jsonTxt = jsonTxt.replace(/ :/g, "\":");
                var newJson = JSON.parse(jsonTxt);

                callback(null, newJson);
            }
        });
    },
}