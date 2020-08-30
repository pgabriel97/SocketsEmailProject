const fs = require('fs');
const accountPath = './database/mailbox.json';

function checkIfAccountExists(wantedMessage, connection) {

    return new Promise((resolve, reject) => {

        if (!connection.hasOwnProperty("currentUsername")) {
            console.log(`Client tried to read a message, but was not logged in.\n`)
            reject(new Error(`ERROR! You cannot read your received messages if you are not logged in!\n`))
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
                    console.log(`User "${connection.currentUsername}" accessed mailbox!\n`)

                    for (let message of mail.messages) {
                        if (message.messageID == wantedMessage) {
                            resolve(`Message from ${message.sender}: "${message.messageContent}"\n`);
                            return;
                        }
                    }


                }
            }

            console.log(`User "${connection.currentUsername}" searched for an unexisting message.\n`)
            resolve(`We couldn't find what you're looking for. Please use "read_mailbox" to check the IDs!\n`);
            return;
        })


    })
}

exports.check = checkIfAccountExists;