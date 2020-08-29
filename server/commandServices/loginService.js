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

                if (JSON.stringify(account) === JSON.stringify(inputAccount)) {
                    console.log(`User "${inputAccount.username}" logged in successfully!`)
                    resolve(`OK! You're logged in now!\n`);
                    return;
                }
            }

            console.log(`WARNING! Wrong username or password for ${JSON.stringify(inputAccount)}.`)
            reject(new Error("Wrong username or password!"));
            return;
        })
    })
}

exports.check = checkIfAccountExists;