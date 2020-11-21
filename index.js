const express = require("express")
const cors = require("cors")

let api = express()

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({extended: true}))

api.listen(process.env.PORT || 8080, () => {
    console.log(`API run on http://localhost:${process.env.PORT || 8080}`)
})