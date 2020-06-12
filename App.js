const express = require('express');
const todo = require('./controller/todoController');
const cors = require('cors')
const signin = require('./controller/signinController');
const register = require('./controller/registerController');
const app = express();

app.use(express.json())

app.use(cors())

// fire controllers
todo(app)
signin(app)
register(app)

//listen to port
app.listen(process.env.PORT || 3001)
console.log(`we are now online on port ${process.env.PORT}`)