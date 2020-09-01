function logout(connection) {
    executeLogout(connection).then((response) => {

        console.log(`Deleting "${connection.currentUsername}" from active users...\n`);
        delete connection.currentUsername

        connection.write(response)

    }, (rejected) => {
        connection.write(rejected.message)
    })
}

function executeLogout(connection) {

    return new Promise((resolve, reject) => {

        if (!connection.hasOwnProperty("currentUsername")) {
            console.log(`ERROR! User tried to log out, but it was not logged in.\n`)
            reject(new Error("ERROR! Unsuccesful log out attempt! User was not logged in.\n"))
            return;
        }

        console.log(`User "${connection.currentUsername}" has logged out!`)
        resolve(`Successfully logged out!\n`)
        return;
    })
}

exports.logout = logout;