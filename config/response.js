async function singleData (reply, statusCode, values, message) {
    reply.status(statusCode).send({
        statusCode : statusCode,
        data : values,
        message : message
    });
}

module.exports = {
    singleData
};