const fs = require('fs');
const accountPath = './database/mailbox.json';

function readMailbox(connection) {
    executeReadMail(connection).then((response) => {
        connection.write(response)
    }, (rejected) => {
        connection.write(rejected.message)
    });
}

function executeReadMail(connection) {

    return new Promise((resolve, reject) => {

        if (!connection.hasOwnProperty("currentUsername")) {
            console.log(`ERROR! Client tried to access its mailbox, but was not logged in.\n`)
            reject(new Error(`ERROR! You cannot access your mailbox if you are not logged in!\n`))
            return;
        }

        fs.readFile(accountPath, { encoding: 'utf8', flag: 'r' }, (err, fileContent) => {
            if (err) {
                throw err;
            }

            jsonContent = JSON.parse(fileContent)
            let userMails = jsonContent.mails;

            for (let mail of userMails) {
                if (mail.receiverUser == connection.currentUsername) {
                    console.log(`User "${connection.currentUsername}" accessed his mailbox!`)

                    let messageIDString = ""
                    for (let message of mail.messages) {
                        messageIDString = messageIDString.concat(message.messageID, " ")
                    }

                    console.log(`User "${connection.currentUsername} accessed mailbox and received message IDs".\n`)
                    resolve(`This are your unread messages. Please use "read_msg id" to read one's content: ${messageIDString}\n`);
                    return;
                }
            }

            console.log(`User "${connection.currentUsername}" tried to access empty mailbox.\n`)
            resolve(`Your mailbox is empty!\n`);
            return;
        })


    })
}

exports.readMailbox = readMailbox;