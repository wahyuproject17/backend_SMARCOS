const conn = require("../initializers/database");

class authModel {
    async register(data){
        return await conn("autentikasi")
            .insert(data)
            .then((res) => res)
            .catch((err) => err);
    }
    async login(username) {
        return await conn("autentikasi")
            .select("*")
            .where("username",username)
            .then((res) => res)
            .catch((err) => err);
    }
}

module.exports = new authModel();