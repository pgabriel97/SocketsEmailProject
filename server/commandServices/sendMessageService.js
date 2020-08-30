const fs = require('fs');
const accountPath = './database/accounts.json';
const mailboxPath = './database/mailbox.json';

function checkIfAccountExists(messageJSON, connection) {

    return new Promise((resolve, reject) => {

        if (!connection.hasOwnProperty("currentUsername")) {
            console.log(`ERROR! Client tried to send a message, but was not logged in.\n`)
            reject(new Error(`ERROR! You cannot send messages if you are not logged in!\n`))
            return;
        }

        // Check if all the user destinations really exist
        fs.readFile(accountPath, { encoding: 'utf8', flag: 'r' }, (err, fileContent) => {
            if (err) {
                throw err;
            }

            destinationsJSON = messageJSON.destinations
            accountsJSON = JSON.parse(fileContent).accounts

            if (!allDestinationExist(destinationsJSON, accountsJSON)) {

                console.log(`User ${connection.currentUsername} couldn't send the message because one of the destinations doesn't exist!\n`)
                reject(new Error(`ERROR! Message not send. At least one wrong destination!\n`))
                return;

            }

            // Add the message on the user's mailboxes
            fs.readFile(mailboxPath, { encoding: 'utf8', flag: 'r' }, (err, mailboxContent) => {
                if (err) {
                    throw err;
                }

                mailsJSON = JSON.parse(mailboxContent).mails
                let finalJSON = createNewMailsJSON(mailsJSON, destinationsJSON, messageJSON, connection)

                let stringifiedJSON = JSON.stringify(finalJSON);

                fs.writeFile(mailboxPath, stringifiedJSON, 'utf8', (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log(`User "${connection.currentUsername}" sent some messages. Mailbox DB updated!\n`)
                    resolve(`OK! Your messages have been successfully sent!\n`);
                })
            })
        })
    })
}
//             })
//         })
//     })
// }



function addUserToMailbox(receiver, content, thisConnection) {
    let receiverUser = receiver;
    let messageID = `message_${Date.now()}`
    let sender = thisConnection.currentUsername
    let messageContent = content.messageToSend
    let messages = [{ messageID, sender, messageContent }]
    mailsJSON.push({ receiverUser, messages })
    return mailsJSON
}

function allDestinationExist(destinations, accounts) {
    let wasFound = -1;

    for (let destination of destinations) {
        if (wasFound != 0) {
            wasFound = 0;
            for (let account of accounts) {
                if (destination == account.username) {
                    wasFound = 1;
                    break
                }
            }
        } else {
            return false;
        }
    }

    if (wasFound == 0) {
        return false;
    }

    return true;
}


function createNewMailsJSON(mails, destinations, messages, connection) {

    if (mails.length == 0) {
        for (let destination of destinations) {
            mails = addUserToMailbox(destination, messages, connection)
        }
    } else {

        wasFound = -1;

        for (let destination of destinations) {
            for (let [i, mail] of mails.entries()) {

                // User already has a message in mailbox --> add just the message
                if (mail.receiverUser == destination) {

                    let messageID = `message_${Date.now()}`
                    let sender = connection.currentUsername
                    let messageContent = messages.messageToSend

                    mail.messages.push({ messageID, sender, messageContent })
                    break;
                }

                // User has no messages in mailbox --> add the user first, then the message for it
                if (i == mails.length - 1) {
                    mails = addUserToMailbox(destination, messages, connection)
                    break;
                }
            }
        }
    }
    return { mails };
}

exports.check = checkIfAccountExists;