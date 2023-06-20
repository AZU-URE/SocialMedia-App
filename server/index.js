import express from "express";
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url";
import { register } from "controllers/auth"

// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url)
// console.log(`this is dirname : ${__dirname}`); : this wont work cause we are using type:module instead of commonjs
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(bodyParser.json({ extended: true, limit: "30mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public", "assets")))

// FILESTORAGE

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage })

// Routes with files

app.post('/auth/register', upload.single, register)

// MONGOOSE SETUP

const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server strted on PORT:${PORT}`))
}).catch((err) => console.log(`${err} error occured`))