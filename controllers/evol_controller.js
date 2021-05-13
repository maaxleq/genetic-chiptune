const express = require("express")
const path = require("path")
const evol = require(path.join(`${global.rootDir}/controllers/evol`))
const storage = require(path.join(`${global.rootDir}/controllers/storage_helper`))
const generator = require(path.join(`${global.rootDir}/controllers/mix_generator`))

let router = express.Router()

router.post("/new", (req, res) => {
    let count = req.body.count;

    try {
        let pop = evol.generateRandomPopulation(count);
        storage.save(pop, 0);
    
        res.end();
    }
    catch(e){    
        res.status(500).send(e.message);
    }
})

router.get("/next", (req, res) => {
    try{
        let popFile = storage.load();
        let next = evol.getNextToEvaluate(popFile.pop);

        if (next == -1){
            res.status(500).send("Fully evaluated generation has not evolved");
        }
        else {
            res.json({
                individual_no: next,
                gen_no: popFile.generation,
            });
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send(e.message); 
    }
})

router.put("/evaluate", (req, res) => {
    try{
        let n = req.body.individual_no;
        let mark = req.body.mark;

        let popFile = storage.load();
        evol.evaluateIndividual(popFile.pop[n], mark);

        let next = evol.getNextToEvaluate(popFile.pop);

        if (next == -1){
            if (! evol.isFullyEvaluated(popFile.pop)){
                res.status(500).send("An individual was skipped during evaluation");
            }

            newPop = evol.evolve(popFile.pop);

            storage.save(newPop, popFile.generation + 1);

            res.json({
                new_generation: true,
            });
        }
        else {
            storage.save(popFile.pop, popFile.generation);

            res.json({
                new_generation: false,
            });
        }
    }
    catch(e){
        res.status(500).send(e.message); 
    }
})

module.exports = router