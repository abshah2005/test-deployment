import dotenv from "dotenv"
import connectDB from "../src/db/db.js"
import { app } from "./app.js"
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') });

connectDB().then(
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server running on port : ${process.env.PORT || 8080}`)
    })
).catch((err) => {
    console.log("MongoDB connection failed !!!", err)
})