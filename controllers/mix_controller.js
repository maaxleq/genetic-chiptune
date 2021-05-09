const express = require("express")
const path = require("path")
const generator = require(path.join(`${global.rootDir}/controllers/mix_generator`))
const evol = require(path.join(`${global.rootDir}/controllers/evol`))

let router = express.Router()

router.get("/random", (req, res) => {
    let generated = generator.fromGenes(evol.generateRandomIndividual())

    if (generated == ""){
        res.status(500).send("Bad genes")
    }
    else {
        res.set("Content-Type", "audio/wav")
        res.send(generated)
    }
})

module.exports = router
