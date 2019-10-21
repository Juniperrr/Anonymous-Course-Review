/*
 * Main API entry point.
 * This file instanciates an Express API, configure the app and start listening for incoming connections.
 */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('../config.json');
const db = require('./db');
const Reviews = require("./model");
const app = express();

// app.use(express.static('public'));
['public', 'css', 'img'].forEach(folder => app.use(express.static(__dirname + '/' + folder)));
// tell the template engine where to find our (templated) html
app.set('views', path.join(__dirname, 'views'));
// use handlebars as the templating engine. Express can support most popular templating engines:
app.set('view engine', 'hbs');

// Initialize middlewares:
// parse `POST` request body
// middleware that only parses urlencoded bodies, only looks at requests (Content-Type header = type option)
app.use(bodyParser.urlencoded({ extended: true })); 
// middleware that only parses json, only looks at requests (Content-Type header = type option)
app.use(bodyParser.json()); 
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false
};
app.use(session(sessionOptions));
app.use(function(req, res, next) {
    console.log('req.query', req.query); // BEWARE: Anything i try to search!!
    res.locals.user = req.user;
    // res.locals.authenticated = ! req.user.anonymous;
    console.log(req.user);
    if (req.session.timesAccessed === undefined) {
        req.session.timesAccessed = 1;
    } else {
        req.session.timesAccessed++;
    }
    console.log('res.locals.timesAccessed', res.locals.timesAccessed);
    console.log('req.session.timesAccessed', req.session.timesAccessed);
    // res.locals.timesAccessed = req.session.timesAccessed;
    next();
});
app.use((req, res, next) => {
    console.log('cookies', req.get('cookie'));
    console.log('req.headers', req.headers);
    next();
});
app.get('/', (req, res) => {
    const queryObj = {};
    if (req.query.yearQ) {
      queryObj.year = parseInt(req.query.yearQ);
    }
    if (req.query.semesterQ) {
      queryObj.semester = req.query.semesterQ;
    }
    if (req.query.professorQ) {
      queryObj.professor = req.query.professorQ;
    }
    console.log(queryObj);
    Reviews.find(queryObj, (err, found, count) => {
        if (err) {
            // error handling?
        }
        res.render('home', {found: found, timesAccessed: req.session.timesAccessed});
    });
});
app.post('/reviews/add', (req, res) => {
    const rev = req.body;
    rev.sid = req.session.id;
    Reviews.create(rev, (err, data) => {
        if (err) {
            res.send(err);
        }
        res.redirect('/');
    });
});
app.get('/reviews/add', (req,res) => {
    res.render('add');
});

app.get('/make-a-cookie', function(req, res) {
    // used append so that we can Set-Cookie more than once
    res.append('Set-Cookie', 'MY_SESSION_ID=123; HttpOnly');
    res.append('Set-Cookie', 'color=#00ff00');
    res.send('made you a cookie');
});

app.get('/reviews/mine', (req, res) => {
    Reviews.find({sid: req.session.id}, (err, found, count) => {
        if (err) {
            // error handling?
        }
        res.render('home', {found: found, timesAccessed: req.session.timesAccessed});
    });
});

app.listen(3000);
console.log('server started!');