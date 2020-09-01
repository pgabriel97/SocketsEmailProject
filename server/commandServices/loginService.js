const fs = require('fs');
const accountPath = './database/accounts.json';

function login(commandArray, connection, connectionArray) {
    let inputAccount = {
        "username": commandArray[1],
        "password": commandArray[2]
    }

    executeLogin(inputAccount, connection, connectionArray).then((response) => {

        connection.currentUsername = inputAccount.username
        console.log(`User "${inputAccount.username}" logged in. Saved its socket connection".\n`)
        connection.write(response)

        for (var i = 0; i < connectionArray.length; i++) {
            if (connectionArray[i] !== connection) {
                connectionArray[i].write(`Say welcome! User "${inputAccount.username}" connected!\n`);
            }
        }

    }, (rejected) => {
        connection.write(rejected.message)
    })
}

function executeLogin(inputAccount, connection, connectionArray) {

    return new Promise((resolve, reject) => {

        for (var i = 0; i < connectionArray.length; i++) {
            if (connectionArray[i].hasOwnProperty("currentUsername")) {
                if (connectionArray[i] == connection) {
                    console.log(`ERROR! User "${inputAccount.username}" tried to connect, but was already logged in.\n`)
                    reject(new Error(`ERROR! You are already logged in!\n`))
                    return;
                } else if (connectionArray[i].currentUsername == inputAccount.username) {
                    // Another user is connected with the same username --> FORCE_LOGOUT
                    console.log(`A second user named "${inputAccount.username}" logged in and forced the first one to log out!\n`)
                    delete connectionArray[i].currentUsername
                    connectionArray[i].write(`You've been forcefully logout!\n`)
                    break;
                }
            }
        }

        fs.readFile(accountPath, { encoding: 'utf8', flag: 'r' }, (err, fileContent) => {
            if (err) {
                throw err;
            }

            jsonContent = JSON.parse(fileContent)

            for (let account of jsonContent.accounts) {

                if (JSON.stringify(account) === JSON.stringify(inputAccount)) {
                    console.log(`User "${inputAccount.username}" logged in successfully!`)
                    resolve(`OK! You're logged in now!\n`);
                    return;
                }
            }

            console.log(`WARNING! Wrong username or password for ${inputAccount.username}.\n`)
            reject(new Error("ERROR! Wrong username or password!\n"));
            return;
        })
    })
}

exports.login = login;