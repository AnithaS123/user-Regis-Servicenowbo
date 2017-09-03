var builder = require('botbuilder');
var restify = require('restify');
var apiai = require('apiai');
const APIAII = apiai('1713551afad04759b3ca39e92f771774');
var uuidv1 = require('uuid/v1')();
require('dotenv-extended').load();
let apiairecognizer = require('api-ai-recognizer');
var unhandledRejection = require("unhandled-rejection");
// var request = require("request");
var SerNow = require('servicenow-rest').gliderecord;

let rejectionEmitter = unhandledRejection({
    timeout: 20
});

rejectionEmitter.on("unhandledRejection", (error, promise) => {
    fs.writeFileSync('./app.json', JSON.stringify(error), 'utf8');
})

rejectionEmitter.on('rejectionHandled', (error, promise) => {
    fs.writeFileSync('./app.json', JSON.stringify(error), 'utf8');
})

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
let connector = new builder.ChatConnector({
    appId: '7194e74e-4a90-4d2d-925f-f408729ac779',
    appPassword: 'TZH8Kmo65HJYFiViFUj8VY8'
});

server.post('/', connector.listen());

let bot = new builder.UniversalBot(connector,  (session) => {
    // session.send("You said: %s", session.message.text);
    // session.send(JSON.stringify(session.message));
    // do check
    if (session.message.text) {
        let request = APIAII.textRequest(session.message.text, {
            sessionId: uuidv1
        });
        request.on('response',  (response) => {
            let result = response.result;
            //do check
            session.send(JSON.stringify(result));
            if (result.metadata.intentName == "Default_Wecome_Intent") {
                session.send("Hi welcome !! \n\n How may I help you");
            } else if (result.metadata.intentName == "User registration") {

                session.send(result.fulfillment.speech);
            } else if (result.metadata.intentName == "User registration - yes") {
                session.send(result.fulfillment.speech);

            } else if (result.metadata.intentName == "User registration - yes - yes") {
                let email = result.parameters["email"];
                let fName = result.parameters["firstname"];
                let lName = result.parameters["lastname"];
                let empId = result.parameters["empId"];
                let password = result.parameters["password"];
                // let password = "john123"
                // let userPassword= result.parameters["password"];
                // let userNameintent= result.parameters["username"];
                if (email != "" && fName !== "" && lName !== "" && empId !== "") {
                    var userdetails = {
                        email: email,
                        user_password: password,
                        first_name: fName,
                        last_name: lName,
                        user_name: fName + "." + lName,
                        employee_number: empId
                    };
                    var sNInserting = new SerNow('dev24552', 'sys_user', 'admin', 'tN7uuKZXmSfU');
                    sNInserting.insert(userdetails).then(function (response) {
                        // session.send("Device has successfully updated!!!");
                        session.send(result.fulfillment.speech);
                    })
                } else {
                    session.send(result.fulfillment.speech);
                }

            } else if (result.metadata.intentName == "User registration - yes DeviceRegistration- yes") {
                let deviceName = result.parameters["Dname"];
                let mobileNum = result.parameters["mobileNumber"];
                let devDes = result.parameters["description"];
                session.send(result.fulfillment.speech);
                if (deviceName != ""  && devDes !== "") {
                    var deviceDetails = {
                        // assigned_to: fName + " " + lName,
                        name: deviceName,
                        short_description: devDes
                    };
                    var sNDeviceInserting = new SerNow('dev24552', 'cmdb_ci_comm', 'admin', 'tN7uuKZXmSfU');
                    sNDeviceInserting.insert(deviceDetails).then(function (response) {
                        // session.send("Device has successfully updated!!!");
                        session.send(result.fulfillment.speech);
                    })
                }
            } else if (result.metadata.intentName == "User registration - yes DeviceRegistration- yes - no") {
                session.send(result.fulfillment.speech);
            } else if (result.metadata.intentName == "Default Fallback Intent") {
                session.send(result.fulfillment.speech);
            }
        });
        request.on('error', function (error) {
            //  console.log(error);
        });
        request.end();
    }

});