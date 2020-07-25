const express = require('express');
const debug = require('debug');
const chalk = require('chalk');
const path = require('path');
const morgan = require('morgan');


const app = express();
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/views', 'index.html'));
})

app.listen(3000,()=>{
    debug(`App running on port ${chalk.green(3000)}`);
})

