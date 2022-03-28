const express = require("express")
const models = require("../models/index")
const pembayaran = models.pembayaran
const app = express()

const authAdmin = require("../auth-admin")
const authPetugas = require("../auth-petugas")
const authSiswa = require("../auth-siswa")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// function CRUD
const getData = async (req, res) => {
    let result = await pembayaran.findAll({
        include: ["petugas",
            "siswa",
            {
                model: models.siswa,
                as: "siswa",
                include: ["spp", "kelas"]
            }
        ]
    })
    res.json(result)
}

const postData = async (req, res) => {
    let data = {
        id_petugas: req.body.id_petugas,
        nisn: req.body.nisn,
        tgl_bayar: new Date().toISOString().split('T')[0],
        bulan_dibayar: req.body.bulan_dibayar,
        tahun_dibayar: req.body.tahun_dibayar,
        id_spp: req.body.id_spp,
        jumlah_bayar: req.body.jumlah_bayar
    }

    pembayaran.create(data)
        .then(result => {
            res.json({ message: "data has been inserted" })
        })
        .catch(error => {
            res.json({ message: error.message })
        })
}

const putData = async (req, res) => {
    let param = await { id_pembayaran: req.body.id_pembayaran }
    let data = await {
        id_petugas: req.body.id_petugas,
        nisn: req.body.nisn,
        tgl_bayar: req.body.tgl_bayar,
        bulan_dibayar: req.body.bulan_dibayar,
        tahun_dibayar: req.body.tahun_dibayar,
        id_spp: req.body.id_spp,
        jumlah_bayar: req.body.jumlah_bayar
    }

    pembayaran.update(data, { where: param })
        .then(result => {
            res.json({ message: "data has been updated" })
        })
        .catch(error => {
            res.json({ message: error.message })
        })
}

const deleteData = async (req, res) => {
    let param = { id_pembayaran: req.params.id_pembayaran }
    pembayaran.destroy({ where: param })
        .then(result => {
            res.json({ message: "data has been destroyed" })
        })
        .catch(error => {
            res.json({ message: error.message })
        })
}


// endpoint for petugas
app.get("/for-petugas", authPetugas, async (req, res) => {
    getData(req, res)
})

app.post("/for-petugas", authPetugas, async (req, res) => {
    postData(req, res)
})

app.put("/for-petugas", authPetugas, async (req, res) => {
    putData(req, res)
})

app.delete("/for-petugas/:id_pembayaran", authPetugas, async (req, res) => {
    deleteData(req, res)
})


// endpoint for admin
app.get("/for-admin", authAdmin, async (req, res) => {
    getData(req, res)
})

app.post("/for-admin", authAdmin, async (req, res) => {
    postData(req, res)
})

app.put("/for-admin", authAdmin, async (req, res) => {
    putData(req, res)
})

app.delete("/for-admin/:id_pembayaran", authAdmin, async (req, res) => {
    deleteData(req, res)
})

// endpoint for siswa
app.get("/for-siswa/:nisn", authSiswa, async(req,res)=>{
    let param = { nisn: req.params.nisn }
    let result = await pembayaran.findAll({
        where:param,
        include: ["petugas",
            "siswa",
            {
                model: models.siswa,
                as: "siswa",
                include: ["spp", "kelas"]
            }
        ]
    })
    res.json(result)
})

module.exports = app