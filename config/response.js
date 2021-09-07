async function singleData (statusCode, values, message, reply) {
    reply.status(statusCode).send({
        statusCode : statusCode,
        data : values,
        message : message
    });
}

module.exports = {
    singleData
};