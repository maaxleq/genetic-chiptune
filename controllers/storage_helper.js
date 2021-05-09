const path = require("path")
const fs = require("fs")

const genomePath = "genome.json"

let helper = {}

helper.save = (genome, generation) => {
    fs.writeFileSync(path.join(global.rootDir, genomePath), JSON.stringify({
        genome: genome,
        generation: generation
    }))
}

helper.load = () => {
    return JSON.parse(fs.readFileSync(path.join(global.rootDir, genomePath)))
}

module.exports = helper