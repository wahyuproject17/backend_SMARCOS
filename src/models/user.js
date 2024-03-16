const conn = require("../initializers/database");

class user {

    async simpan(data){
        return await conn("tbl_user")
            .insert(data)
            .then((res) => res)
            .catch((err) => err);
    }
    async edit({ id_user, data }) {
        return await conn("tbl_user")
            .where("id_crud", id_user)
            .update(data)
            .then((res) => res)
            .catch((err) => err);
    }
    async delete({id_user}) {
         return await conn("tbl_user")
            .where("id_crud", id_user)
            .del()
            .then((res) => res)
            .catch((err) => err);
    }
    async show() {
        return await conn("tbl_user")
            .select("*")
            .then((res) => res)
            .catch((err) => err);
    }

   
}

module.exports = new crud();