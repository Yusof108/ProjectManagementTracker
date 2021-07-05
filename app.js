require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const passport = require('passport')


//Initialize app
const app = express()
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware
app.use(cors())

//Static directory
app.use(express.static(path.join(__dirname, 'public')))

//Passport Middleware
app.use(passport.initialize())

//Passport Strategy
require('./config/passport')(passport)




mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("connected to mongo"))
    .catch((err) => console.log(err));

app.use("/api/task", require("./routes/routes"));
app.use("/api/project", require("./routes/projectRoutes"));




const user = require('./routes/api/user')
app.use('/api/user', user)

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));