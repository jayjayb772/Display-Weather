function clickSendTextDTO(clickSendTextBody){
    return {
        from: clickSendTextBody.from,
        message: clickSendTextBody.message,
        timestamp: clickSendTextBody.timestamp
    }
}

function sendSingleTextDTO(orchestratorReqBody){
    return {
        to:orchestratorReqBody.to,
        message:orchestratorReqBody.message
    }
}
function sendMultipleTextsDTO(orchestratorReqBody){
    return {
        relationship:orchestratorReqBody.relationship,
        message:orchestratorReqBody.message
    }
}

module.exports = {clickSendTextDTO, sendSingleTextDTO, sendMultipleTextsDTO}