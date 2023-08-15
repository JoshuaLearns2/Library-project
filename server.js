const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

mongoose.connect("mongodb+srv://jlmeeks587:supersecret@cluster0.y0duuvm.mongodb.net/?retryWrites=true&w=majority", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String
    },
    cover: {
        type: String
    },
    readStatus: {
        type: Boolean
    },
    favoriteStatus: {
        type: Boolean
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    securePassword: {
        type: String,
        required: true
    },
    library: {
        type: String
    },
    role: {
        type: String,
        required: true
    }
});

let tokenDB = []
  
const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);

app.get('/api/library', async (req, res) => {
    const library = await Book.find();
    return res.json(library);
})

app.post('/api/library', (req, res) => {
    const { title, author, cover, readStatus, favoriteStatus } = req.body
    const book = new Book({ title, author, cover, readStatus, favoriteStatus });
    book.save();
    return res.send(book._id);
})

app.put('/api/library/:id', async (req, res) => {
    const { id } = req.params;
    await Book.replaceOne({_id: id}, req.body);
    return res.end();
})

app.delete('/api/library/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    return res.end();
})

app.post('/api/users/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const securePassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, securePassword, role: 'basic'});
    user.save()
    return res.send(user._id)
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.find({ username: username })
    
    if (user.length === 0) {
        res.send({ message: "Incorrect username and/or password" })
    } else {
        const match = await bcrypt.compare(password, user[0].securePassword);
        if (match) {
            const accessToken = jwt.sign({"username": user[0].username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300' })
            const refreshToken = jwt.sign({"username": user[0].username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
            tokenDB.push(refreshToken)
            // res.cookie('jwt', accessToken, { httpOnly: true,  maxAge: 24 * 60 * 60 * 1000 })
            res.cookie('jwt', "hereisacookie")
            res.send({ message: `Welcome back, ${username}`, accessToken: accessToken, refreshToken: refreshToken })
        } else {
            res.send({ message: "Incorrect username and/or password" })
        }
    }
})

const verifyToken = (req, res, next) => {
    const authHeader = req.header.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token is not valid")
            req.user = user
            next()
        })
    } else {
        res.status(401).json("You are not authenticated")
    }
}

app.delete('/api/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (user) {
        res.status(200).json("User has been deleted")
    } else {
        res.status(403).json("You do not have the proper authorization")
    }
})

app.post('/api/refresh', async (req, res) => {
    const refreshToken = req.body.token

    if (!refreshToken) return res.status(401).json("You do not have the proper authorization")
    if (!tokenDB.includes(refreshToken)) return res.status(403).json("Token is not valid")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        err && console.log(err)
        tokenDB = tokenDB.filter(token => token !== refreshToken)
        const newAccessToken = jwt.sign({"username": user.username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300' })
        const newRefreshToken = jwt.sign({"username": user.username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
        tokenDB.push(newRefreshToken)
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    })
})

app.post('/api/logout', verifyToken, (req, res) => {
    const refreshToken = req.body.token
    tokenDB => tokenDB.filter(token => token !== refreshToken )
    res.status(200).json("You logged out successfully")
})

app.get('/api/cookiejar', (req, res) => {
    res.cookie('jwt', 'jsonwebtokengoeshere')
    res.send({ message: "get your hand outta here"})
})


app.listen(8080, () => console.log('Server successfully started'))