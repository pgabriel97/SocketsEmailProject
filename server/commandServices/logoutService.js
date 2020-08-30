function checkIfAccountExists(connection) {

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

exports.check = checkIfAccountExists;