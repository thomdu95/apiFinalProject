const express = require("express")
const cors = require("cors")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { verifyToken, verifyTokenDel } = require("./middleware")


let api = express()

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({extended: true}))


api.post('/user', (req, res) => {
    try {
        if (!req.body.email) throw "Provide a email"
        if (!req.body.name) throw "Provide a name"
        if (!req.body.password) throw "Provide a password"
        if (!req.body.picture) throw "Provide a profile picture"

        let users = JSON.parse(fs.readFileSync('./cred.json'))
        if (users.find(elem => elem.email === req.body.email)) throw "Email already exist"

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) throw err
            let newUser = {
                email: req.body.email,
                name: req.body.name,
                password: hash,
                picture: req.body.picture
            }
            users.push(newUser)
            fs.writeFileSync('./cred.json', JSON.stringify(users))
            res.send("SUCCESS")
        })
    } catch(error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.post('/signin', (req, res) => {
    try {
        if (!req.body.email) throw "Provide a email"
        if (!req.body.password) throw "Provide a password"

        let users = JSON.parse(fs.readFileSync('./cred.json'))
        let test = users.find(elem => elem.email === req.body.email)
        if (!test) throw "User does not exist"

        bcrypt.compare(req.body.password, test.password)
        .then(resp => {
            if (!resp) throw "Bas Password"
            let token = jwt.sign({email: req.body.email}, "secret")
            res.send(token)
        })
        .catch(err => {
            res.status(203).send("ERROR : " + err)
        })
    } catch (error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.get('/articles', (req, res) => {
    res.send(JSON.parse(fs.readFileSync('./articles.json')))
})

api.put('/articles/:id', verifyToken, (req, res) => {
    try {
        let articles = JSON.parse(fs.readFileSync('./articles.json'))
        let finded = false
        articles.forEach(elem => {
            if (elem.id == req.params.id) {
                finded = true
                elem.title = req.body.title || elem.title
                elem.description = req.body.description || elem.description
                elem.content = req.body.content || elem.content
                elem.mainPic = req.body.mainPic || elem.mainPic
                elem.modified_at = Date.now()
            }
        })
        if (!finded) throw "Article does not exist at ID = " + req.params.id
        fs.writeFileSync('./articles.json', JSON.stringify(articles))
        res.send("SUCCESS")
    } catch (error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.delete('/articles/:id/:email', verifyTokenDel, (req, res) => {
    try {
        let articles = JSON.parse(fs.readFileSync('./articles.json'))
        let finded = articles.findIndex(elem => elem.id == req.params.id)
        if (finded === -1) throw "Article does not exist at ID = " + req.params.id
        articles = [...articles.slice(0, finded), ...articles.slice(finded + 1, articles.length)]

        fs.writeFileSync('./articles.json', JSON.stringify(articles))
        res.send("SUCCESS")
    } catch (error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.post('/articles',  verifyToken , (req, res) => {
    try {
        if (!req.body.email) throw "Provide your Email"
        if (!req.body.title) throw "Provide a title to your article"
        if (!req.body.description) throw "Provide a description to your article"
        if (!req.body.content) throw "Provide a content to your article"
        if (!req.body.mainPic) throw "Provide a mainPic to your article"
        let articles = JSON.parse(fs.readFileSync('./articles.json'))
        let newArticle = {
            email: req.body.email,
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            mainPic: req.body.mainPic,
            id: Date.now(),
            created_at: Date.now(),
            modified_at: Date.now(),
            like: 0,
            dislike: 0
        }
        articles.push(newArticle)
        fs.writeFileSync('./articles.json', JSON.stringify(articles))
        res.send("SUCCESS")

    } catch (error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.post('/articles/like/:id', (req, res) => {
    try {
        let articles = JSON.parse(fs.readFileSync('./articles.json'))
        let finded = false
        articles.forEach(elem => {
            if (elem.id == req.params.id) {
                finded = true
                elem.like += 1
                elem.modified_at = Date.now()
            }
        })
        if (!finded) throw "Article does not exist at ID = " + req.params.id
        fs.writeFileSync('./articles.json', JSON.stringify(articles))
        res.send("SUCCESS")
    } catch (error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.post('/articles/dislike/:id', (req, res) => {
    try {
        let articles = JSON.parse(fs.readFileSync('./articles.json'))
        let finded = false
        articles.forEach(elem => {
            if (elem.id == req.params.id) {
                finded = true
                elem.dislike += 1
                elem.modified_at = Date.now()
            }
        })
        if (!finded) throw "Article does not exist at ID = " + req.params.id
        fs.writeFileSync('./articles.json', JSON.stringify(articles))
        res.send("SUCCESS")
    } catch (error) {
        res.status(203).send("ERROR : " + error)
    }
})

api.listen(process.env.PORT || 8080, () => {
    console.log(`API run on http://localhost:${process.env.PORT || 8080}`)
})