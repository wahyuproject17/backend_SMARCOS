const database = require('../initializers/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    profile(req,res){
        let id_user = req.session.usersid
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM user_register where user_id = '${id_user}';
                `
            , function (error, results) {
                if(error) throw error;
                res.render("profile",{
                    url: 'http://localhost:3000/',
                    userName: req.session.email,
                    nama: results[0]['nama_lengkap'],
                    email: results[0]['email']
                });
            });
            connection.release();
        })
    }
}