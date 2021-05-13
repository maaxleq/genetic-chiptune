const express = require("express")
const path = require("path")
const generator = require(path.join(`${global.rootDir}/controllers/mix_generator`))
const evol = require(path.join(`${global.rootDir}/controllers/evol`))
const storage = require(path.join(`${global.rootDir}/controllers/storage_helper`))

let router = express.Router()

router.get("/generate", (req, res) => {
    try{
        let index = req.query.individual_no;

        let popFile = storage.load();
        let genome = popFile.pop[index];
        let wav = generator.fromGenes(genome);

        res.set("Content-Type", "audio/wav");
        res.send(wav);
    }
    catch(e){
        res.status(500).end(e.message); 
    }
})

router.post("/generate_from_genes", (req, res) => {
    try{
        let genome = JSON.parse(req.body.genome);
        let wav = generator.fromGenes(genome);

        res.set("Content-Type", "audio/wav");
        res.send(wav);
    }
    catch(e){
        res.status(500).end(e.message); 
    }
})

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
