const registerService = require('./commandServices/registerService')
const loginService = require('./commandServices/loginService')
const logoutService = require('./commandServices/logoutService')
const readMailService = require('./commandServices/readMailService')
const readMessageService = require('./commandServices/readMessageService')
const sendMessageService = require('./commandServices/sendMessageService')

var net = require('net')

var connectionArray = []

var server = net.createServer(function (connection) {

    connectionArray.push(connection)

    console.log(`Client connected: ${connection.remoteAddress}, ${connection.remotePort}\n`)

    connection.on('data', function (data) {

        let commandArray = data.toString().split(" ")

        console.log(`You received the command: ${commandArray}`)

        if (commandArray[0] == "create_account") {
            registerService.createAccount(commandArray, connection)
        }

        if (commandArray[0] == "login") {
            loginService.login(commandArray, connection, connectionArray)
        }

        if (commandArray[0] == "logout") {
            logoutService.logout(connection)
        }

        if (commandArray[0] == "send") {
            sendMessageService.send(commandArray, connection, connectionArray)
        }

        if (commandArray[0] == "read_mailbox") {
            readMailService.readMailbox(connection)
        }

        if (commandArray[0] == "read_msg") {
            readMessageService.readMessage(commandArray, connection)
        }

    })
})

server.listen(6666, () => console.log(`Server is listening...`));