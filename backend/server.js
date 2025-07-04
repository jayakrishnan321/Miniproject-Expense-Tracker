const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require("dotenv").config()
const app = express()


app.use(cors())
app.use(express.json())

app.use("/api/users", require("./Route/UserRouter")); // Auth routes
app.use("/api/expenses", require("./Route/ExpenseRouter"));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('mongodb connected succesfully')
}).catch((err) => {
    console.log(err)
})

const PORT = 5000
app.listen(PORT, () => {
    console.log("server started at port 5000")
})