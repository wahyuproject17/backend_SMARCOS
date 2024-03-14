const response = (statusCode, data, message, res) => {
    res.json(statusCode,[
        {
        payload:{
            status_code: statusCode,
            data: data,
            message: message
        },
        Metadata: {
            prev: "",
            current: "",
            next: ""
        }
    }])
}

module.exports = response