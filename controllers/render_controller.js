const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing')

let router = express.Router()

let loader = new TwingLoaderFilesystem(path.join(`${global.rootDir}/public/templates`))
let twing = new TwingEnvironment(loader)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

router.get("/font/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/fonts/${req.params.file}.ttf`))
})

router.get("/css/:file", (req, res) => {
    res.set("Content-Type", "text/css")
    res.sendFile(path.join(`${global.rootDir}/public/css/${req.params.file}.css`))
})

router.get("/js/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/js/${req.params.file}.js`))
})

router.get("/svg/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/img/${req.params.file}.svg`))
})

router.get("/", (req, res) => {
    twing.render("index.twig").then(output => {
        res.end(output)
    })
})

module.exports = router