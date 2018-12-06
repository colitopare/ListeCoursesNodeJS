const express = require('express')
const config = require('./config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const app = express()

const port = 3000

// Database avec une fonction de callback then pour dire qu'on est bien connecter
//mongoose.connect('mongodb://localhost/courses', { useNewUrlParser: true }).then(() => {
//    console.log('Connection OK à la base de donnée');
//});

// Si on utilise une Bdd comme mLab on utilisera les configs du fichier config.js
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@ds211774.mlab.com:11774/courses`, { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'))
db.once('open', () => {
    console.log('connected to the DB :-)')
})

/* Moteur de template, ici avec pug */
app.set('view engine', 'pug')

/* Middlewares */
// sert à dire  le nom du dossier où vont se trouver les fichiers statique (css, js, images ….)
app.use(express.static(__dirname + '/public'))
// Body parser
// Analyser les corps des demandes entrantes dans un middleware avant vos gestionnaires
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json)
// remplacer avec POST ayant? _method = DELETE
app.use(methodOverride('_method'))
// Permet de passer des cookie de session facilement d'une page à l'autre pour gérer les message d'erreur
// stoker en mémoire locale et as sur un serveur
app.use(session({
    secret: 'rfrggggbcx',   // clé secrète qui nous servira à chiffré notre cookie
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false       // false car on ne traite pas en https
    }
}))

/* Routes */
const index = require('./routes/index')
app.use('/', index)



app.listen(port, () => console.log(`Serveur lancé sur le port ${port}`))