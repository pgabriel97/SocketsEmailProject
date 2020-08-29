const registerService = require('./commandServices/registerService')
const loginService = require('./commandServices/loginService')

var net = require('net');
let clients = []

var server = net.createServer(function (connection) {

    console.log("Client connected\n");

    connection.on('data', function (data) {

        let commandArray = data.toString().split(" ");

        console.log("You received the command:    ", commandArray)

        if (commandArray[0] == "create_account") {

            let inputAccount = {
                "username": commandArray[1],
                "password": commandArray[2]
            }

            registerService.check(inputAccount).then((response) => {
                connection.write(response);
            }, (rejected) => {
                connection.write(`ERROR! This username is already taken!\n`)
            })
        }



        if (commandArray[0] == "login") {

            let inputAccount = {
                "username": commandArray[1],
                "password": commandArray[2]
            }

            loginService.check(inputAccount).then((response) => {
                clients.push(connection);
                console.log("THIS IS YOUR CONNECTION   ", clients);
                connection.write(response);
            }, (rejected) => {
                connection.write(`Wrong username or password!\n`)
            })

        }

        if (commandArray[0] == "send") {

            console.log('Request from', connection.remoteAddress, 'port', connection.remotePort);

            let inputAccount = {
                "username": commandArray[1],
                "password": commandArray[2]
            }

            for (i = 0; i < clients.length; i++) {
                console.log(clients[i].remotePort)
                clients[i].write("cf\n")
            }



            // loginService.check(inputAccount).then((response) => {
            //     connection.write(response);
            // }, (rejected) => {
            //     connection.write(`Wrong username or password!\n`)
            // })

        }


    });

})

server.listen(6666, () => console.log(`Server is listening...`));