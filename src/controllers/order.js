const database = require('../initializers/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    createOrder(req, res){
        let id_user = req.session.userid;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let hargasatuan = req.body.hargaikan;
        let harga = jumlahikan * hargasatuan;

        if(id_user && jenisikan && jumlahikan && harga){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `INSERT INTO tbl_pesanan(id_user, jenis_ikan, jumlah_ikan, harga) VALUES (?,?,?,?); `,
                    [id_user, jenisikan, jumlahikan, harga], function (error, results){
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