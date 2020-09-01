const fs = require('fs');
const accountPath = './database/accounts.json';
const mailboxPath = './database/mailbox.json';

function send(commandArray, connection, connectionArray) {
    let destinations = commandArray.splice(1, commandArray.length - 2)
    let messageToSend = commandArray[commandArray.length - 1]

    let sendJSON = { destinations, messageToSend }

    executeSendMessage(sendJSON, connection, connectionArray).then((response) => {
        connection.write(response)
    }, (rejected) => {
        connection.write(rejected.message)
    });
}

function executeSendMessage(messageJSON, connection, connectionArray) {

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
                let finalJSON = createNewMailsJSON(mailsJSON, destinationsJSON, messageJSON, connection, connectionArray)

                let stringifiedJSON = JSON.stringify(finalJSON);

                fs.writeFile(mailboxPath, stringifiedJSON, 'utf8', (err) => {
                    if (err) {
                        throw err;
                    }

                    // Send notification to connected users

                    console.log(`User "${connection.currentUsername}" sent some messages. Mailbox DB updated!\n`)
                    resolve(`OK! Your messages have been successfully sent!\n`);
                })
            })
        })
    })
}

function addUserToMailbox(receiver, content, thisConnection, connectionArray) {
    let receiverUser = receiver;
    let messageID = `message_${Date.now()}`
    let sender = thisConnection.currentUsername
    let messageContent = content.messageToSend
    let messages = [{ messageID, sender, messageContent }]
    mailsJSON.push({ receiverUser, messages })

    sendMessageToUser(receiver, `NEW_MESSAGE_IN_MAILBOX ${messageID}`, connectionArray)

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


function createNewMailsJSON(mails, destinations, messages, connection, connectionArray) {

    if (mails.length == 0) {
        for (let destination of destinations) {
            mails = addUserToMailbox(destination, messages, connection, connectionArray)
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

                    sendMessageToUser(destination, `NEW_MESSAGE_IN_MAILBOX ${messageID}!`, connectionArray)
                    break;
                }

                // User has no messages in mailbox --> add the user first, then the message for it
                if (i == mails.length - 1) {
                    mails = addUserToMailbox(destination, messages, connection, connectionArray)
                    break;
                }
            }
        }
    }
    return { mails };
}


function sendMessageToUser(receiver, message, connectionArray) {
    for (var i = 0; i < connectionArray.length; i++) {
        if (connectionArray[i].hasOwnProperty("currentUsername") && connectionArray[i].currentUsername == receiver) {
            connectionArray[i].write(`${message}\n`);
        }
    }
}

exports.send = send;