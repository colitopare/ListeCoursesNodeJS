const express = require('express')
const router = express.Router()

const Article = require('../models/Article')

let articles

router.get('/', (req, res) => {
    // systeme de Message Flash
    // permet de passer dans locals.error le message d'erreur s'il y en a un
    // évite de passer la variable error a res.render
    if (req.session.error) {
        res.locals.error = req.session.error
        // Permet de supprimer le message au prochain rechargement de la page
        req.session.error = undefined
    }
    if (req.session.success) {
        res.locals.success = req.session.success
        // Permet de supprimer le message au prochain rechargement de la page
        req.session.success = undefined
    }
    articles = []
    Article.find((err, articlesFind) => {
        if (err) {
            console.error('couldt not retrieve articles from DB')
            res.sendStatus(500)
        } else {
            console.log(articlesFind)
            res.render('index', {
                articles: articlesFind
            })
        }
    })
})

// Cette route permet de faire un traitement sans que l'utilisateur s'en aperçoive 
// grâce au router.post
router.post('/add', (req, res) => {
    //  console.log(req.body.article);
    if (req.body.article === undefined || req.body.article === '') { 
        // permet de stocker en session, ici une erreur
        req.session.error = `Vous n'avez pas rentré d'article `
        res.redirect('/')
    } else {

        // formatage du texte avec la première lettre en majuscule et le reste en minuscule
        function firstUpperRestLower(texte) {
            texteLower = texte.trim().toLowerCase()
            premiereLettre = texteLower.substring(0, 1).toUpperCase()
            texteFormater = premiereLettre + texteLower.substring(1, texteLower.lenght)
            return texteFormater
        }

        // rechercher si l'article est déjà saisie      
        Article.findOne({
                    designation: firstUpperRestLower(req.body.article)
                    },
                    (err, resFind) => {
            if (err) {
                console.error(err);
                return;
            } else {
                if (resFind && firstUpperRestLower(resFind.designation) === firstUpperRestLower(req.body.article)) {
                    req.session.error = `L'article est déjà dans la liste` 
                    res.redirect('/')                             
                } else {
                    // Création d'une instance de mon modèle article
                    const newArticle = new Article({
                        designation: firstUpperRestLower(req.body.article)
                    })
                    // Persistance en Bdd
                    newArticle
                        .save((err, savedArticle) => {
                            if (err) {
                                console.error(err);
                                return;
                            } else {
                                // savedArticle, retournera l'id du dernier article rentré en Bdd
                                console.log('savedArticle', savedArticle)
                                // Message Flash
                                req.session.success = `Votre article a bien été enregistré`
                                res.redirect('/')
                            }
                        })   
                }
            }
        }) 
    }
})

router.delete('/delete/:id', (req, res) => {
    // req.params.id permet de récupérer id passer dans l'url
    //console.log(req.params.id);
    Article.findByIdAndDelete(req.params.id, () =>{
        // Message Flash
        req.session.success = `Votre article a bien été supprimé`
        res.redirect('/')
    })
})

router.get('/update/:id', (req, res) =>{
    Article.findById(req.params.id, (err, article) =>{
        // Je renvoie à la vue l'objet récupérer
        res.render('update', {
            article: article
        })
    })
})

router.put('/update/:id', (req, res) =>{
    Article.findByIdAndUpdate(req.params.id, { designation: req.body.article }, (err) => {
        if (err) {
            console.error(err)
            return;
        } else {
            // Message Flash
            req.session.success = `Votre article a bien été modifié`
            res.redirect('/')
        }
    })
})

module.exports = router