const path = require("path")
const fs = require("fs")

const popPath = "pop.json"

let helper = {}

helper.save = (pop, generation) => {
    fs.writeFileSync(path.join(global.rootDir, popPath), JSON.stringify({
        pop: pop,
        generation: generation
    }))
}

helper.load = () => {
    return JSON.parse(fs.readFileSync(path.join(global.rootDir, popPath)))
}

module.exports = helper