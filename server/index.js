const registerService = require('./commandServices/registerService')
const loginService = require('./commandServices/loginService')
const logoutService = require('./commandServices/logoutService')
const readMailService = require('./commandServices/readMailService')
const readMessageService = require('./commandServices/readMessageService')
const sendMessageService = require('./commandServices/sendMessageService')

var net = require('net')

var connectionArray = []

var server = net.createServer(function (connection) {

    console.log(`Client connected: ${connection.remoteAddress}, ${connection.remotePort}\n`)

    connection.on('data', function (data) {

        let commandArray = data.toString().split(" ")

        console.log(`You received the command: ${commandArray}`)

        if (commandArray[0] == "create_account") {

            let inputAccount = {
                "username": commandArray[1],
                "password": commandArray[2]
            }

            registerService.check(inputAccount, connection).then((response) => {
                connection.write(response)
            }, (rejected) => {
                connection.write(rejected.message)
            })
        }


        if (commandArray[0] == "login") {

            let inputAccount = {
                "username": commandArray[1],
                "password": commandArray[2]
            }

            loginService.check(inputAccount, connection).then((response) => {

                connection.currentUsername = inputAccount.username
                connectionArray.push(connection)
                console.log(`User "${inputAccount.username}" logged in. Saved its socket connection".\n`)
                connection.write(response)

            }, (rejected) => {
                connection.write(rejected.message)
            })
        }


        if (commandArray[0] == "logout") {

            logoutService.check(connection).then((response) => {

                console.log(`Deleting "${connection.currentUsername}" from active users...\n`);
                delete connection.currentUsername

                connection.write(response)

            }, (rejected) => {
                connection.write(rejected.message)
            })
        }

        if (commandArray[0] == "send") {

            let destinations = commandArray.splice(1, commandArray.length - 2)
            let messageToSend = commandArray[commandArray.length - 1]

            let sendJSON = { destinations, messageToSend }

            sendMessageService.check(sendJSON, connection).then((response) => {
                connection.write(response)
            }, (rejected) => {
                connection.write(rejected.message)
            });

        }

        if (commandArray[0] == "read_mailbox") {
            readMailService.check(connection).then((response) => {
                connection.write(response)
            }, (rejected) => {
                connection.write(rejected.message)
            });
        }

        if (commandArray[0] == "read_msg") {
            readMessageService.check(commandArray[1], connection).then((response) => {
                connection.write(response)
            }, (rejected) => {
                connection.write(rejected.message)
            });
        }

    })
})

server.listen(6666, () => console.log(`Server is listening...`));