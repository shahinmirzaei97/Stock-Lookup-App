const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const { finished } = require('stream');

const PORT = process.env.PORT || 5000;

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));

// Call API Function
function callAPI(finishedAPI, ticker){
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_dbc3f878a679463c815ff58561634437', {json : true}, (err, res, body) => {
        if (err) {return console.log(err);}
        if (res.statusCode === 200){
            finishedAPI(body);
        };
    });
}


// Set Handlebars Middleware
app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// Set Handlebar Index Get Route
app.get('/', function (req, res,) {
    callAPI(function(doneAPI){
        res.render('home', {
            stockData : doneAPI
        });
    }, "AAPL");
});

// Set Handlebar Index Post Route
app.post('/', function (req, res,) {
    callAPI(function(doneAPI){
        //posted_request = req.body.stock_ticker;
        res.render('home', {
            stockData : doneAPI
        });
    }, req.body.stock_ticker);
});
// About page route
app.get('/about', function (req, res,) {
    res.render('about');
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));



app.listen(PORT, () => console.log('Server listening on port ' + PORT));