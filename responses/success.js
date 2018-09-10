var code;
var message;
var data ="";

function Response(code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
}
module.exports = Response;
