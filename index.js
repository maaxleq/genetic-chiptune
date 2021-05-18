global.rootDir = __dirname

const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const multer = require("multer")

require("dotenv").config();

const upload = multer()
const appRouter = require("./controllers/app_router")

const host = process.env.HTTP_HOST
const port = process.env.HTTP_PORT

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.array());

app.use(appRouter)

http.createServer(app).listen(port, host)
