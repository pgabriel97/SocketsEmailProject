const fs = require('fs');
const accountPath = './database/accounts.json';

function checkIfAccountExists(inputAccount, connection) {

    return new Promise((resolve, reject) => {

        if (connection.hasOwnProperty("currentUsername")) {
            console.log(`ERROR! User "${connection.currentUsername}" tried create another account while already logged in.\n`)
            reject(new Error(`ERROR! You cannot create an account while you are already logged in!\n`))
           return;
       }

        fs.readFile(accountPath, { encoding: 'utf8', flag: 'r' }, (err, fileContent) => {
            if (err) {
                throw err;
            }

            jsonContent = JSON.parse(fileContent)

            // Checking if username already exists
            for (let account of jsonContent.accounts) {
                if (account.username == inputAccount.username) {
                    console.log(`ERROR! Could not create "${inputAccount.username} account. It already exists.\n`)
                    reject(new Error("ERROR! This username is already taken!\n"));
                    return;
                }
            }

            // Username doesn't exist, so we can create it and add it to database
            jsonContent.accounts.push(inputAccount);
            let stringifiedJSON = JSON.stringify(jsonContent);

            fs.writeFile(accountPath, stringifiedJSON, 'utf8', (err) => {
                if (err) {
                    throw err;
                }

                console.log(`Adding "${inputAccount.username}" to the DB...\n`)
                resolve(`OK! Account ${inputAccount.username} successfully created!\n`);
            })

        })
    })
}

exports.check = checkIfAccountExists;