const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const axios = require('axios');
const http = require('http');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');
var jsonParser = bodyParser.json();
require('dotenv').config();
const auth = require('./middleware/auth');
const IP = require('ip');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var URL = 'mongodb+srv://Emmanuel:Emmanuel199627@cluster0.44jw3e7.mongodb.net/test';

const nodemailer = require("nodemailer");

app.use(express.json());
const db = mongoose.connection

mongoose.connect('mongodb+srv://Emmanuel:Emmanuel199627@cluster0.44jw3e7.mongodb.net/test',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log(err));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/addNewMessage', jsonParser, function (req, res) {
    console.log(req.body)
    const message = new Message({
        ...req.body
    });
    var nodeoutlook = require('nodejs-nodemailer-outlook')
    nodeoutlook.sendEmail({
        auth: {
            user: "mat_et_manu@hotmail.fr",
            pass: "Ght6mdak3?"
        },
        from: 'mat_et_manu@hotmail.fr',
        to: 'emmanueldessaint27220@gmail.com',
        subject: 'Contact Mécabécane',
        html: `nom : ${req.body.nom} <br/>prenom : ${req.body.prenom} <br/>mail : ${req.body.mail} <br/>message: ${req.body.message}`,
        text: 'This is text version!',
        replyTo: 'emmanueldessaint27220@gmail.com',
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
    message.save()
        .then(() => res.status(201).json({ message: 'Message envoyé !' }))
        .catch(error => res.status(400).json({ error }));
})

app.post('/api/addNewOrder', jsonParser, function (req, res) {
    console.log(req.body)
    const message = new Message({
        ...req.body
    });
    var nodeoutlook = require('nodejs-nodemailer-outlook')
    nodeoutlook.sendEmail({
        auth: {
            user: "mat_et_manu@hotmail.fr",
            pass: "Ght6mdak3?"
        },
        from: 'mat_et_manu@hotmail.fr',
        to: req.body.mail,
        subject: 'Commande Mécabécane',
        html: `Merci pour votre achat ${req.body.prenom}, <br/> Votre commande a bien été enregistrée !`,
        text: 'This is text version!',
        replyTo: 'emmanueldessaint27220@gmail.com',
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    });
    message.save()
        .then(() => res.status(201).json({ message: 'Message envoyé !' }))
        .catch(error => res.status(400).json({ error }));
})

app.use('/api/allMessage', function (req, res) {
    const ipAddress = IP.address();
    console.log(ipAddress)
    Message.find()
        .then(messages => res.status(200).json(messages))
        .catch(error => res.status(400).json({ error }));
})

app.post('/api/login', function (req, res) {
    console.log(req.body)
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        token: jwt.sign(
                            { userId: 'mail' },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '72h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
})

app.post('/api/register', function (req, res) {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                admin: false
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
})

module.exports = app;