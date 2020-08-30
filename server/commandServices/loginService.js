const fs = require('fs');
const accountPath = './database/accounts.json';

function checkIfAccountExists(inputAccount, connection) {

    return new Promise((resolve, reject) => {

        if (connection.hasOwnProperty("currentUsername")) {
             console.log(`ERROR! User "${inputAccount.username}" tried to connect, but was already logged in.\n`)
             reject(new Error(`ERROR! You are already logged in!\n`))
            return;
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

exports.check = checkIfAccountExists;