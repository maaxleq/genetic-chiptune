const express = require("express")
const path = require("path")
const evol = require(path.join(`${global.rootDir}/controllers/evol`))

let router = express.Router()



module.exports = router