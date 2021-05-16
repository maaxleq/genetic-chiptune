global.rootDir = __dirname

const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const multer = require("multer")

const upload = multer()
const appRouter = require("./controllers/app_router")

const host = "0.0.0.0"
const port = 8080

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.array());

app.use(appRouter)

http.createServer(app).listen(port, host)
