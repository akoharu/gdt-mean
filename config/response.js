async function singleData (reply, statusCode, values, message) {
    reply.status(statusCode).send({
        statusCode : statusCode,
        data : values,
        message : message
    });
}
async function paginateData (reply, statusCode, values, paginate, message) {
    reply.status(statusCode).send({
        statusCode : statusCode,
        data : values,
        paginate: paginate,
        message : message
    });
}
module.exports = {
    singleData, paginateData
};