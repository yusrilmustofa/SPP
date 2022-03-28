const express = require("express")
const models = require("../models/index")
const siswa = models.siswa
const app = express()
const md5 = require("md5")

const multer = require("multer")
const path = require("path")
const fs = require("fs")

const SECRET_KEY_SISWA = "cobaajadulu"
const authSiswa = require("../auth-siswa")
const authAdmin = require("../auth-admin")
const authPetugas = require("../auth-petugas")
const jwt = require("jsonwebtoken") 



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const storage = multer.diskStorage({
    destination: (req, file, cal) => {
        cal(null, "./image/siswa_img")
    },
    filename: (req, file, cal) => {
        cal(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({ storage: storage })

// end point for siswa
app.get("/for-siswa/:nisn", authSiswa, async (req, res) => {
    let param = {
        nisn: req.params.nisn
    }
    let result = await siswa.findAll(
        {
            where: param,
            include: ["kelas", "spp"]
        })

    res.json(result)
})

// end point for petugas
app.get("/for-petugas", authPetugas, async (req, res) => {
    let result = await siswa.findAll(
        {
            include: ["kelas", "spp"]
        })

    res.json(result)
})

app.get("/for-petugas/nisn/:nisn", authPetugas, async (req, res) => {
    let param = {
        nisn: req.params.nisn
    }
    let result = await siswa.findOne(
        {
            where: param,
            include: ["kelas", "spp"]
        })

    res.json(result)
})

app.get("/for-petugas/nama/:nama", authPetugas, async (req, res) => {
    let param = {
        nama: req.params.nama
    }
    let result = await siswa.findOne(
        {
            where: param,
            include: ["kelas", "spp"]
        })
    res.json(result)
})

// end point for admin
app.get("/for-admin", authAdmin, async (req, res) => {
    let result = await siswa.findAll(
        {
            include: ["kelas", "spp"]
        })

    res.json(result)
})

app.get("/for-admin/nisn/:nisn", authAdmin, async (req, res) => {
    let param = {
        nisn: req.params.nisn
    }
    let result = await siswa.findOne(
        {
            where: param,
            include: ["kelas", "spp"]
        })

    res.json(result)
})

app.get("/for-admin/nama/:nama", authAdmin, async (req, res) => {
    let param = {
        nama: req.params.nama
    }
    let result = await siswa.findOne(
        {
            where: param,
            include: ["kelas", "spp"]
        })

    res.json(result)
})
app.post("/", authAdmin, upload.single("image"), async (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    } else {
        let data = {
            nisn: req.body.nisn,
            nis: req.body.nis,
            nama: req.body.nama,
            id_kelas: req.body.id_kelas,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            id_spp: req.body.id_spp,
            username: req.body.username,
            password: md5(req.body.password),
            image: req.file.filename
        }

        siswa.create(data)
            .then(result => {
                res.json({ message: "data has been inserted" })
            })
            .catch(error => {
                res.json({ message: error.message })
            })
    }
})

app.put("/", authAdmin, upload.single("image"), async (req, res) => {
    let param = await { nisn: req.body.nisn }
    let data = await {
        nisn: req.body.nisn,
        nis: req.body.nis,
        nama: req.body.nama,
        id_kelas: req.body.id_kelas,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        id_spp: req.body.id_spp,
        username: req.body.username,
        password: md5(req.body.password),
    }

    if (req.file) {
        const row = siswa.findOne({ where: param })
            .then(result => {
                let oldImageName = result.image

                let dir = path.join(__dirname, "../image/siswa_img", oldImageName)
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message)
            })

        data.image = req.file.filename
    }

    siswa.update(data, { where: param })
        .then(result => {
            res.json({ message: "data has been updated" })
        })
        .catch(error => {
            res.json({ message: error.message })
        })
})

app.delete("/:nisn", authAdmin, async (req, res) => {
    let param = { nisn: req.params.nisn }
    let result = await siswa.findOne({ where: param })
    let oldImageName = result.image

    let dir = path.join(__dirname, "../image/siswa_img", oldImageName)
    fs.unlink(dir, err => console.log(err))

    siswa.destroy({ where: param })
        .then(result => {
            res.json({ message: "data has been destroyed" })
        })
        .catch(error => {
            res.json({ message: error.message })
        })
})

app.post("/login", async (req, res) => {
    let param = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await siswa.findOne({ where: param })
    if (result) {
        let payload = JSON.stringify(result)
        let token = jwt.sign(payload, SECRET_KEY_SISWA)

        res.json({
            logged: true,
            data: result,
            role: "siswa",
            token: token
        })
    } else {
        res.json({
            logged: false,
            message: "invalid username or password"
        })
    }
})

module.exports = app