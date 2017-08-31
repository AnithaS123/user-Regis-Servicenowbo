
require('dotenv-extended').load();
var builder = require('botbuilder');
var restify = require('restify');
var apiairecognizer = require('api-ai-recognizer');
const unhandledRejection = require("unhandled-rejection");
var request = require("request");

var serviceNow = require('servicenow-rest').gliderecord;
let fs = require('fs');

let rejectionEmitter = unhandledRejection({
    timeout: 20
});

rejectionEmitter.on("unhandledRejection", (errro,promise)=>{
    fs.writeFileSync('./app.json', JSON.stringify(errro),'utf8');
})

rejectionEmitter.on('RejectionHandlen', (error,promise)=>{
    fs.writeFileSync('./app.json', JSON.stringify(error),'utf8');
})



var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: 'd60f4a2a-5926-42c5-baa6-db7a8ddcd162',
    appPassword: '2uiQBbbGGAhkxnGVJDBeb9X'
});



var sN = new serviceNow({
    instance: 'dev24552',
    tablename: 'sys_user',
    user: 'admin',
    password: 'GcXuKjkVNSZq',
    v1: 'v1'
});

sN.setReturnFields('number', 'short_description');
sN.addEncodedQuery('active=true');
sN.setLimit(10);

gr.query().then(function (result) { //returns promise 
    console.log(result)
})

// gr.setReturnFields('number,short_description');


// var inc = new GlideRecord('incident');
// inc.addActiveQuery();
// inc.query();

var port = process.env.PORT || 5000;
app.set('port', port);
app.listen(port, function () {
    console.log('Client server listening on port ' + port);
});