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
                        req.flash('message', 'Pesanan berhasil ditambahkan');
                    
                        res.redirect('/');
                    }
                )
            })
        }
    },
    getOrder(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_pesanan, tbl_user WHERE tbl_pesanan.id_user = tbl_user.id_user`, function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        });
    },
    getOrderById(req, res){
        let id = get.params.idpesanan;
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_pesanan, tbl_user WHERE tbl_pesanan.id_user = tbl_user.id_user, id_pesanan = ?`, [id], function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        }); 
    },
    updateOrder(req, res){
        let id_order = req.params.idpesanan;
        let id_user = req.session.userid;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let hargasatuan = req.body.hargaikan;
        let harga = jumlahikan * hargasatuan;
        if(id_user && jenisikan && jumlahikan && harga){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `UPDATE tbl_pesanan SET jumlah_ikan = ?, harga = ? WHERE id_pesanan = ?;`,
                    [jumlahikan, harga, id_order], function(error, result){
                        if(error) throw error;
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Ubah pesanan berhasil');

                        res.redirect('/');
                    }
                )
            })
        }else {
            req.flash('color', 'danger');
            req.flash('status', 'gagal');
            req.flash('message', 'Mohon cek kembali data yang anda masukkan');
            
            res.redirect('/');
            res.end();
        }
    },
    deleteOrder(req, res){
        let idorder = req.params.idpesanan;

        if(idorder){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `DELETE FROM tbl_pesanan WHERE id_pesanan = ?`, [idorder],
                    function(error, result){
                        if(error) throw error;
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Penghapusan berhasil');

                        res.redirect('/');
                    }
                )
            })
        }
    }
}