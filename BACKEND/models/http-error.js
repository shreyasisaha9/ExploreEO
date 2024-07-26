class HttpError extends Error{
    constructor(message,errorCode){
        super(message); //Add a "message" property // must write at first
        this.code = errorCode;//Add a "code' property

    }

}

module.exports = HttpError;