const tone = require("tonegenerator")
const header = require("waveheader")
const evol = require("./evol")

const shapes = {
    melody: "sine",
    drums: "saw"
}

const baseFreqs = [16.35, 18.36, 20.6, 21.83, 24.5, 27.5, 30.87]
const rythms = ["d","tt","tff","fft","yyy","ffff","Tf","fT","t2","ff2","2t","2ff","1"]

const mixLengthInSecs = 10

let generator = {}

function largestSample(samples){
    let maximum = 0
    let topSampleIndex = 0

    for (let i = 0; i < samples.length; i++){
        if (samples[i].length > maximum){
            maximum = samples[i].length
            topSampleIndex = i
        }
    }

    return samples[topSampleIndex]
}

function computeNextNote(n, delta){
    let nextOctave, nextNote
    let nextNoteNumber = 7 * n.octave + n.note + delta
    if (nextNoteNumber >= 0 && nextNoteNumber <= 76){
        nextOctave = Math.floor(nextNoteNumber / 7)
        nextNote = nextNoteNumber % 7
    }
    else {
        nextOctave = nextNote = 0
    }

    return {
        octave: nextOctave,
        note: nextNote
    }
}

function computeNoteFreq(n){
    return baseFreqs[n.note] * (2 ** n.octave)
}

function fadeOut(sample){
    let res = []

    for (let i = 0; i < sample.length; i++){
        let ratio = (sample.length - i) / sample.length
        res.push(Math.round(sample[i] * ratio))
    }

    return res
}

function generateSample(length = 0, freq = 0, shape = "sine", silent = false, beats = false){
    let sample = tone({
        freq: freq,
        volume: tone.MAX_8 / 2,
        shape: shape,
        lengthInSecs: length
    })

    if (silent){
        sample.fill(0)
    }
    else if (beats){
        sample = fadeOut(sample)
    }

    return sample
}

function combineSamplesParallel(samples){
    let res = []
    let combinedSample

    for (let i = 0; i < largestSample(samples).length; i++) {
        combinedSample = 0
        for (let j = 0; j < samples.length; j++) {
            if (samples[j][i] != undefined){
                combinedSample += samples[j][i]
            }
        }

        res.push(combinedSample)
    }

    return res
}

function combineSamplesSerial(samples){
    let res = []

    for (sample of samples){
        res = res.concat(sample)
    }

    return res
}

function generateHeader(sample){
    return header(sample.length, {
        bitDepth: 8
    })
}

function generateWav(sample){
    let data = Uint8Array.from(sample, function (value) {
        return value + 128
    })

    let headBuffer = generateHeader(sample)

    let sampleBuffer = Buffer.from(data)

    let wavBuffer = Buffer.concat([headBuffer, sampleBuffer])

    return wavBuffer
}

function geneIsBetween(value, limits){
    return value >= limits[0] && value <= limits[1]
}

function genesCorrect(genes){
    let limits = evol.limits

    return      geneIsBetween(genes.tempo, limits.tempo)
            &&  geneIsBetween(genes.melody.baseOctave, limits.melodyBaseOctave)
            &&  geneIsBetween(genes.drums.baseOctave, limits.drumsBaseOctave)
            &&  geneIsBetween(genes.melody.rythm1, limits.rythm)
            &&  geneIsBetween(genes.drums.rythm1, limits.rythm)
            &&  geneIsBetween(genes.melody.rythm2, limits.rythm)
            &&  geneIsBetween(genes.drums.rythm2, limits.rythm)
            &&  geneIsBetween(genes.melody.deltaNotes1, limits.deltaNotes)
            &&  geneIsBetween(genes.drums.deltaNotes1, limits.deltaNotes)
            &&  geneIsBetween(genes.melody.deltaNotes2, limits.deltaNotes)
            &&  geneIsBetween(genes.drums.deltaNotes2, limits.deltaNotes)
            &&  geneIsBetween(genes.melody.scheme1, limits.scheme)
            &&  geneIsBetween(genes.drums.scheme1, limits.scheme)
            &&  geneIsBetween(genes.melody.scheme2, limits.scheme)
            &&  geneIsBetween(genes.drums.scheme2, limits.scheme)
            &&  geneIsBetween(genes.melody.baseNote1, limits.baseNote)
            &&  geneIsBetween(genes.drums.baseNote1, limits.baseNote)
            &&  geneIsBetween(genes.melody.baseNote2, limits.baseNote)
            &&  geneIsBetween(genes.drums.baseNote2, limits.baseNote)
            &&  geneIsBetween(genes.melody.rythm3, limits.rythm)
            &&  geneIsBetween(genes.drums.rythm3, limits.rythm)
            &&  geneIsBetween(genes.melody.rythm4, limits.rythm)
            &&  geneIsBetween(genes.drums.rythm4, limits.rythm)
            &&  geneIsBetween(genes.melody.deltaNotes3, limits.deltaNotes)
            &&  geneIsBetween(genes.drums.deltaNotes3, limits.deltaNotes)
            &&  geneIsBetween(genes.melody.deltaNotes4, limits.deltaNotes)
            &&  geneIsBetween(genes.drums.deltaNotes4, limits.deltaNotes)
            &&  geneIsBetween(genes.melody.scheme3, limits.scheme)
            &&  geneIsBetween(genes.drums.scheme3, limits.scheme)
            &&  geneIsBetween(genes.melody.scheme4, limits.scheme)
            &&  geneIsBetween(genes.drums.scheme4, limits.scheme)
            &&  geneIsBetween(genes.melody.baseNote3, limits.baseNote)
            &&  geneIsBetween(genes.drums.baseNote3, limits.baseNote)
            &&  geneIsBetween(genes.melody.baseNote4, limits.baseNote)
            &&  geneIsBetween(genes.drums.baseNote4, limits.baseNote)
}

function computeCyclesCount(tempo){
    let cycleLength = 120 / tempo

    return Math.ceil(mixLengthInSecs / cycleLength)
}

function generateNote(n, symbol, tempo, shape, beats = false){
    if (isSilent(symbol)){
        return generateSample(computeSymbolLength(symbol, tempo), 0, shape, true)
    }
    else {
        return generateSample(computeSymbolLength(symbol, tempo), computeNoteFreq(n), shape, false, beats)
    }
}

function computeSymbolLength(symbol, tempo){
    let baseLength = 0
    switch(symbol){
        case "d":
        case "1":
            baseLength = 1
            break
        case "t":
        case "2":
            baseLength = 0.5
            break
        case "f":
            baseLength = 0.25
            break
        case "y":
            baseLength = 1/3
            break
        case "T":
            baseLength = 0.75
            break
    }

    return baseLength * 60 / tempo
}

function isSilent(symbol){
    return ["1","2","4"].includes(symbol)
}

function generateTrackCycle(trackGenes, tempo, shape, beats = false){
    let cycle = []

    let currentNote = {}

    //First beat
    currentNote = {
        octave: trackGenes.baseOctave,
        note: trackGenes.baseNote1
    }

    for (symbol of rythms[trackGenes.rythm1]){
        cycle = combineSamplesSerial([cycle, generateNote(currentNote, symbol, tempo, shape, beats)])

        let delta = 0
        if (trackGenes.scheme1 == 0){
            delta = - trackGenes.deltaNotes1
        }
        else if (trackGenes.scheme1 == 2){
            delta = trackGenes.deltaNotes1
        }

        currentNote = computeNextNote(currentNote, delta)
    }

    //Second beat
    currentNote = {
        octave: trackGenes.baseOctave,
        note: trackGenes.baseNote2
    }

    for (symbol of rythms[trackGenes.rythm2]){
        cycle = combineSamplesSerial([cycle, generateNote(currentNote, symbol, tempo, shape, beats)])

        let delta = 0
        if (trackGenes.scheme2 == 0){
            delta = - trackGenes.deltaNotes2
        }
        else if (trackGenes.scheme2 == 2){
            delta = trackGenes.deltaNotes2
        }

        currentNote = computeNextNote(currentNote, delta)
    }

    //Third beat
    currentNote = {
        octave: trackGenes.baseOctave,
        note: trackGenes.baseNote3
    }

    for (symbol of rythms[trackGenes.rythm3]){
        cycle = combineSamplesSerial([cycle, generateNote(currentNote, symbol, tempo, shape, beats)])

        let delta = 0
        if (trackGenes.scheme3 == 0){
            delta = - trackGenes.deltaNotes3
        }
        else if (trackGenes.scheme3 == 2){
            delta = trackGenes.deltaNotes3
        }

        currentNote = computeNextNote(currentNote, delta)
    }

    //Fourth beat
    currentNote = {
        octave: trackGenes.baseOctave,
        note: trackGenes.baseNote4
    }

    for (symbol of rythms[trackGenes.rythm4]){
        cycle = combineSamplesSerial([cycle, generateNote(currentNote, symbol, tempo, shape, beats)])

        let delta = 0
        if (trackGenes.scheme4 == 0){
            delta = - trackGenes.deltaNotes4
        }
        else if (trackGenes.scheme4 == 2){
            delta = trackGenes.deltaNotes4
        }

        currentNote = computeNextNote(currentNote, delta)
    }

    return cycle
}

generator.fromGenes = (genes = {}) => {
    if (genesCorrect(genes)){
        let tempo = genes.tempo
        let melody = genes.melody
        let drums = genes.drums

        let cycles = [generateTrackCycle(melody, tempo, shapes.melody), generateTrackCycle(drums, tempo, shapes.drums, true)]

        let mixCycle = combineSamplesParallel(cycles)

        let mixArray = Array(computeCyclesCount(tempo)).fill(mixCycle)
        let mix = combineSamplesSerial(mixArray)

        return generateWav(mix)
    }
    else {
        return ""
    }
}

module.exports = generator
