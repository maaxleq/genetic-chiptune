const express = require("express")
const path = require("path")
const evol = require(path.join(`${global.rootDir}/controllers/evol`))
const storage = require(path.join(`${global.rootDir}/controllers/storage_helper`))

let router = express.Router()

router.post("/new", (req, res) => {
    let count = req.body.count;

    try {
        let pop = evol.generateRandomPopulation(count);
        storage.save(pop, 1);
    
        res.end();
    }
    catch(e){    
        res.status(500).end(e);
    }
})

router.get("/next", (req, res) => {
    try{
        let popFile = storage.load();
        let next = evol.getNextToEvaluate(popFile.pop);

        if (next == -1){
            res.send("Population is fully evaluated");
        }
        else {
            res.json(popFile.pop[next]);
        }
    }
    catch(e){
        res.status(500).end(e); 
    }
})

router.put("/rate", (req, res) => {
    try{
        let n = req.body.rate_no;
        let mark = req.body.mark;

        let popFile = storage.load();
        evol.evaluateIndividual(popFile.pop[n], mark);

        let next = evol.getNextToEvaluate(popFile.pop);

        if (next == -1){
            newPop = evol.evolve(popFile.pop);

            storage.save(newPop, popFile.generation + 1);

            res.json({
                individual: newPop[0],
                individual_no: 0,
                gen_no: popFile.generation + 1,
                new_gen: true,
            });
        }
        else {
            storage.save(popFile.pop, popFile.generation);

            res.json({
                individual: popFile.pop[next],
                individual_no: next,
                gen_no: popFile.generation,
                new_gen: false,
            });
        }
    }
    catch(e){
        res.status(500).end(e); 
    }
})

module.exports = router