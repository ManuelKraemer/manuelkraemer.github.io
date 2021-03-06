const express = require("express");
const parser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
    client: 'pg',
    version: '10.0',
    connection: {
      host : '127.0.0.1',
      user : 'Manuel',
      password : '',
      database : 'IEMPlayer'
    }
  });

const app = express();

const database = {
    users: [{
        id: '123',
        name: 'john',
        email: 'john@gmail.com',
        password: 'cookies',
        entries: 0,
        joined: new Date() 
    },
    {
        id: '1234',
        name: 'sally',
        email: 'sally@gmail.com',
        password: 'bananas',
        entries: 0,
        joined: new Date() 
    }]
};


db.select('*').from('users').then(data => {
    console.log(data);
});

app.use(parser.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.send(database.users);
});

app.post('/signin', (req, res)=>{
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0])
    } else{
        res.status(400).json("You are not registered");
    }
});

app.post('/register', (req, res)=>{
    let {email, name, password} = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user =>{
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
});


app.get('/profile/:id', (req, res)=>{
    const { id } = req.params;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id){
            return res.json(user);
            found = true;
        }
    });
    if(!found){
        res.status(400).json("not found");
    }
});

app.put('/image', (req,res)=>{
    const { id } = req.body;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if(!found){
        res.status(400).json("not found");
    }

});


app.listen(3001, ()=>{
    console.log("Server is running");
});