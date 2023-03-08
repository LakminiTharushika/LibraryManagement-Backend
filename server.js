let express = require("express")
let mongoose = require('mongoose')
let cors = require('cors')
let path = require('path')
const { MONGO_URI } = require("./keys");

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
    credentials: true,
};

// const api = require('./backend/routes') admin2021 123456

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.connection.on("connected", () => {
    console.log("mongodb is connected");
});

const app = express();
app.use(express.json())
app.use(cors(corsOptions));

app.use('/public', express.static('public'));

app.use('/api/users', require("./routes/student_route"))
app.use('/api/books', require("./routes/book_route"))
app.use('/api/issues', require("./routes/issue_route"))


if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static('https://libmanfront.onrender.com/'))

    app.get('*', (req, res) => {

        res.sendFile(path.resolve(__dirname, 'https://libmanfront.onrender.com/index.html'))

    })
}


const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

app.use((req, res, next) => {
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});