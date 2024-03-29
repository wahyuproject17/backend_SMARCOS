const database = require('../initializers/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    addTulisan(req, res){
        let ucapan = get.body.ucapan;
        let alamat = get.body.alamat;
        let telepon = get.body.telepon;
        let instagram = get.body.instagram;
        let email = get.body.email;

        if(ucapan && alamat && telepon && instagram && email){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `INSERT INTO tbl_tulisan(ucapan, alamat, telepon, instagram, email) VALUES (?,?,?,?,?); `,
                    [ucapan, alamat, telepon, instagram, email], function (error, results){
                        if (error) throw error;
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Penambahan berhasil');
                    
                        res.redirect('/');
                    }
                )
            })
        }
    }
}