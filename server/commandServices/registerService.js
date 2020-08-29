const fs = require('fs');
const accountPath = './database/accounts.json';

function checkIfAccountExists(inputAccount) {

    return new Promise((resolve, reject) => {
        fs.readFile(accountPath, { encoding: 'utf8', flag: 'r' }, (err, fileContent) => {
            if (err) {
                throw err;
            }

            jsonContent = JSON.parse(fileContent)

            for (let account of jsonContent.accounts) {
                if (account.username == inputAccount.username) {
                    console.log(`WARNING! Could not add ${JSON.stringify(inputAccount)} to the DB.`)
                    reject(new Error("This username is already taken!"));
                    return;
                }
            }

            jsonContent.accounts.push(inputAccount);
            let stringifiedJSON = JSON.stringify(jsonContent);

            fs.writeFile(accountPath, stringifiedJSON, 'utf8', (err) => {
                if (err) {
                    throw err;
                }

                console.log(`Adding ${JSON.stringify(inputAccount)} to the DB...`)
                resolve(`OK! Account ${inputAccount.username} successfully created!\n`);
            })

        })
    })
}

exports.check = checkIfAccountExists;