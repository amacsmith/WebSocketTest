const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');



// Init Nexmo
const nexmo = new Nexmo({
    apiKey: '858ca41c',
    apiSecret: 'tslCqTj5f9bd2WJC'
}, {debug: true});

// Init App
const app = express();

// Template Engine setup

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


// public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

// catch form submit
app.post('/', (req, res) => {
    res.send(req.body);
    console.log(req.body);

    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        '12014398628', number, text, {type: 'unicode'},
        (err, responseData) => {
            if(err){
                console.log(err)
            } else {
                console.log(responseData);
                const data = {
                    id: responseData.messages[0]['message-id'].message,
                    number: responseData.messages[0]['to']
                }    

                io.emit('smsStatus', data);
            }
        } 
    );
});

// define port
const port = 3000;

// start server
const server = app.listen(port, () => console.log(`Server Started on port ${port}`))


const io = socketio(server);

io.on('connection', (socket) => {
    console.log('Connected');
})

io.on('disconnect', () => {
    console.log("Disconnected")
})
