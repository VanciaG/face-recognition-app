const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const fetch = require('node-fetch');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile'); 
const image = require('./controllers/image'); 
const auth = require('./controllers/authorization'); 

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('succcess') })

app.post('/signin', signin.signinAuthentication(db, bcrypt));

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res, fetch) });


app.listen(3000, () => {
    console.log('app is running on port 3000');
});
