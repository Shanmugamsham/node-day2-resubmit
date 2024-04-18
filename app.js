const express=require("express")
const app=express()
const routers=require("./routes/routers")
require('dotenv').config()
app.use(express.json())
app.use(routers)
app.listen(process.env.port)













