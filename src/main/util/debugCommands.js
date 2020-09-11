function debuglog(debugMessage){
    if(process.env.DEBUG) {
        console.log(debugMessage);
    }
}

module.exports = {debuglog};