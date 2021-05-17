/*
Tracks

melody
bassline
drums
*/

let evol = {}

evol.limits = {
    tempo: [60,240],
    melodyBaseOctave: [3,5],
    drumsBaseOctave: [1,3],
    rythm: [0,12],
    deltaNotes: [1,5],
    scheme: [0,2],
    baseNote: [0,6]
}

function generateRandomGene(type){
    let lim = evol.limits[type]

    return Math.round(Math.random() * (lim[1] - lim[0]) + lim[0])
}

evol.generateRandomIndividual = () => {
    return {
        mark: null,
        tempo: generateRandomGene("tempo"),
        melody: {
            baseOctave: generateRandomGene("melodyBaseOctave"),
            rythm1: generateRandomGene("rythm"),
            rythm2: generateRandomGene("rythm"),
            rythm3: generateRandomGene("rythm"),
            rythm4: generateRandomGene("rythm"),
            deltaNotes1: generateRandomGene("deltaNotes"),
            deltaNotes2: generateRandomGene("deltaNotes"),
            deltaNotes3: generateRandomGene("deltaNotes"),
            deltaNotes4: generateRandomGene("deltaNotes"),
            scheme1: generateRandomGene("scheme"),
            scheme2: generateRandomGene("scheme"),
            scheme3: generateRandomGene("scheme"),
            scheme4: generateRandomGene("scheme"),
            baseNote1: generateRandomGene("baseNote"),
            baseNote2: generateRandomGene("baseNote"),
            baseNote3: generateRandomGene("baseNote"),
            baseNote4: generateRandomGene("baseNote")
        },
        drums: {
            baseOctave: generateRandomGene("drumsBaseOctave"),
            rythm1: generateRandomGene("rythm"),
            rythm2: generateRandomGene("rythm"),
            rythm3: generateRandomGene("rythm"),
            rythm4: generateRandomGene("rythm"),
            deltaNotes1: generateRandomGene("deltaNotes"),
            deltaNotes2: generateRandomGene("deltaNotes"),
            deltaNotes3: generateRandomGene("deltaNotes"),
            deltaNotes4: generateRandomGene("deltaNotes"),
            scheme1: generateRandomGene("scheme"),
            scheme2: generateRandomGene("scheme"),
            scheme3: generateRandomGene("scheme"),
            scheme4: generateRandomGene("scheme"),
            baseNote1: generateRandomGene("baseNote"),
            baseNote2: generateRandomGene("baseNote"),
            baseNote3: generateRandomGene("baseNote"),
            baseNote4: generateRandomGene("baseNote")
        }
    }
}

evol.generateRandomPopulation = (count) => {
    let pop = []

    for (let i = 0; i < count; i++){
        pop.push(evol.generateRandomIndividual())
    }

    return pop
}

function selectGene(g1, g2){
    return Math.random() > 0.5 ? g1 : g2
}

function crossOver(i1, i2){
    return {
        tempo: selectGene(i1.tempo, i2.tempo),
        melody: {
            baseOctave: selectGene(i1.melody.baseOctave, i2.melody.baseOctave),
            rythm1: selectGene(i1.melody.rythm1, i2.melody.rythm1),
            rythm2: selectGene(i1.melody.rythm2, i2.melody.rythm2),
            rythm3: selectGene(i1.melody.rythm3, i2.melody.rythm3),
            rythm4: selectGene(i1.melody.rythm4, i2.melody.rythm4),
            deltaNotes1: selectGene(i1.melody.deltaNotes1, i2.melody.deltaNotes1),
            deltaNotes2: selectGene(i1.melody.deltaNotes2, i2.melody.deltaNotes2),
            deltaNotes3: selectGene(i1.melody.deltaNotes3, i2.melody.deltaNotes3),
            deltaNotes4: selectGene(i1.melody.deltaNotes4, i2.melody.deltaNotes4),
            scheme1: selectGene(i1.melody.scheme1, i2.melody.scheme1),
            scheme2: selectGene(i1.melody.scheme2, i2.melody.scheme2),
            scheme3: selectGene(i1.melody.scheme3, i2.melody.scheme3),
            scheme4: selectGene(i1.melody.scheme4, i2.melody.scheme4),
            baseNote1: selectGene(i1.melody.baseNote1, i2.melody.baseNote1),
            baseNote2: selectGene(i1.melody.baseNote2, i2.melody.baseNote2),
            baseNote3: selectGene(i1.melody.baseNote3, i2.melody.baseNote3),
            baseNote4: selectGene(i1.melody.baseNote4, i2.melody.baseNote4)
        },
        drums: {
            baseOctave: selectGene(i1.drums.baseOctave, i2.drums.baseOctave),
            rythm1: selectGene(i1.drums.rythm1, i2.drums.rythm1),
            rythm2: selectGene(i1.drums.rythm2, i2.drums.rythm2),
            rythm3: selectGene(i1.drums.rythm3, i2.drums.rythm3),
            rythm4: selectGene(i1.drums.rythm4, i2.drums.rythm4),
            deltaNotes1: selectGene(i1.drums.deltaNotes1, i2.drums.deltaNotes1),
            deltaNotes2: selectGene(i1.drums.deltaNotes2, i2.drums.deltaNotes2),
            deltaNotes3: selectGene(i1.drums.deltaNotes3, i2.drums.deltaNotes3),
            deltaNotes4: selectGene(i1.drums.deltaNotes4, i2.drums.deltaNotes4),
            scheme1: selectGene(i1.drums.scheme1, i2.drums.scheme1),
            scheme2: selectGene(i1.drums.scheme2, i2.drums.scheme2),
            scheme3: selectGene(i1.drums.scheme3, i2.drums.scheme3),
            scheme4: selectGene(i1.drums.scheme4, i2.drums.scheme4),
            baseNote1: selectGene(i1.drums.baseNote1, i2.drums.baseNote1),
            baseNote2: selectGene(i1.drums.baseNote2, i2.drums.baseNote2),
            baseNote3: selectGene(i1.drums.baseNote3, i2.drums.baseNote3),
            baseNote4: selectGene(i1.drums.baseNote4, i2.drums.baseNote4)
        }
    }
}

function mutate(i){
    let geneToMutate = Math.round(Math.random() * 34)

    let newIndividual = i

    switch(geneToMutate){
        case 0:
            newIndividual.tempo = generateRandomGene("tempo")
            break
        case 1:
            newIndividual.melody.baseOctave = generateRandomGene("melodyBaseOctave")
            break
        case 2:
            newIndividual.melody.rythm1 = generateRandomGene("rythm")
            break
        case 3:
            newIndividual.melody.rythm2 = generateRandomGene("rythm")
            break
        case 4:
            newIndividual.melody.rythm3 = generateRandomGene("rythm")
            break
        case 5:
            newIndividual.melody.rythm4 = generateRandomGene("rythm")
            break
        case 6:
            newIndividual.melody.deltaNotes1 = generateRandomGene("deltaNotes")
            break
        case 7:
            newIndividual.melody.deltaNotes2 = generateRandomGene("deltaNotes")
            break
        case 8:
            newIndividual.melody.deltaNotes3 = generateRandomGene("deltaNotes")
            break
        case 9:
            newIndividual.melody.deltaNotes4 = generateRandomGene("deltaNotes")
            break
        case 10:
            newIndividual.melody.scheme1 = generateRandomGene("scheme")
            break
        case 11:
            newIndividual.melody.scheme2 = generateRandomGene("scheme")
            break
        case 12:
            newIndividual.melody.scheme3 = generateRandomGene("scheme")
            break
        case 13:
            newIndividual.melody.scheme4 = generateRandomGene("scheme")
            break
        case 14:
            newIndividual.melody.baseNote1 = generateRandomGene("baseNote")
            break
        case 15:
            newIndividual.melody.baseNote2 = generateRandomGene("baseNote")
            break
        case 16:
            newIndividual.melody.baseNote3 = generateRandomGene("baseNote")
            break
        case 17:
            newIndividual.melody.baseNote4 = generateRandomGene("baseNote")
            break
        case 18:
            newIndividual.drums.baseOctave = generateRandomGene("drumsBaseOctave")
            break
        case 19:
            newIndividual.drums.rythm1 = generateRandomGene("rythm")
            break
        case 20:
            newIndividual.drums.rythm2 = generateRandomGene("rythm")
            break
        case 21:
            newIndividual.drums.rythm3 = generateRandomGene("rythm")
            break
        case 22:
            newIndividual.drums.rythm4 = generateRandomGene("rythm")
            break
        case 23:
            newIndividual.drums.deltaNotes1 = generateRandomGene("deltaNotes")
            break
        case 24:
            newIndividual.drums.deltaNotes2 = generateRandomGene("deltaNotes")
            break
        case 25:
            newIndividual.drums.deltaNotes3 = generateRandomGene("deltaNotes")
            break
        case 26:
            newIndividual.drums.deltaNotes4 = generateRandomGene("deltaNotes")
            break
        case 27:
            newIndividual.drums.scheme1 = generateRandomGene("scheme")
            break
        case 28:
            newIndividual.drums.scheme2 = generateRandomGene("scheme")
            break
        case 29:
            newIndividual.drums.scheme3 = generateRandomGene("scheme")
            break
        case 30:
            newIndividual.drums.scheme4 = generateRandomGene("scheme")
            break
        case 31:
            newIndividual.drums.baseNote1 = generateRandomGene("baseNote")
            break
        case 32:
            newIndividual.drums.baseNote2 = generateRandomGene("baseNote")
            break
        case 33:
            newIndividual.drums.baseNote3 = generateRandomGene("baseNote")
            break
        case 34:
            newIndividual.drums.baseNote4 = generateRandomGene("baseNote")
            break
    }

    return newIndividual
}

evol.evaluateIndividual = (i, mark) => {
    let newIndividual = i

    newIndividual.mark = parseInt(mark)

    return newIndividual
}

function sortPopulation(pop){
    let newPop = pop

    return newPop.sort((i1, i2) => {
        return i2.mark - i1.mark
    })
}

evol.getNextToEvaluate = pop => {
    for (let i = 0; i < pop.length; i++){
        if (pop[i].mark == null){
            return i;
        }
    }

    return -1;
}

evol.isFullyEvaluated = pop => {
    for (let i = 0; i < pop.length; i++){
        if (pop[i].mark == null){
            return false;
        }
    }

    return true;
}

evol.evolve = (pop) => {
    let newPop = []
    let count = pop.length

    pop = sortPopulation(pop)

    for (let i = 0; i < 4; i++){
        pop[i].mark = null;
    }

    newPop.push(pop[0])
    
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (i > j){
                newPop.push(crossOver(pop[i], pop[j]))
            }
        }
    }

    while (newPop.length < count){
        newPop.push(evol.generateRandomIndividual())
    }

    for (let i = 0; i < newPop.length; i++){
        newPop[i] = mutate(newPop[i])
    }

    return newPop
}

module.exports = evol
