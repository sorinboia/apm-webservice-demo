const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const port = process.env.PORT || 8081;        // set our port
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const routes = require('./router');
app.use('/',routes);


app.listen(port);
console.log('Listening on port',port);