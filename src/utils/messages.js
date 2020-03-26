const generateMessage = (username, message) => {
    return {
        username,
        message,
        //returns miliseconds since Unix Epoch
        //moment.js will format and display the date on client side so that time zone is correct
        createdAt: new Date().getTime()
    }
}



module.exports = {
    generateMessage
}