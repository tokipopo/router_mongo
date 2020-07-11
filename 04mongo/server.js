let express = require('express');
var bodyParser = require('body-parser');

const {json} = require('body-parser');
const allRouter = require('./routers/index');
const {port} = require('./config.json')
let app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(allRouter);  

app.use(express.static('./'));

app.listen(port,()=>{
    console.log(`success,post is ${port}`);
})
