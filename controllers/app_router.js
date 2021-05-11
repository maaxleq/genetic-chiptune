const express = require("express")
const path = require("path")

const renderController = require(path.join(`${global.rootDir}/controllers/render_controller`))
const mixController = require(path.join(`${global.rootDir}/controllers/mix_controller`))
const evolController = require(path.join(`${global.rootDir}/controllers/evol_controller`))

let router = express.Router()

router.use("/", renderController)
router.use("/mix", mixController)
router.use("/evol", evolController)

module.exports = router
