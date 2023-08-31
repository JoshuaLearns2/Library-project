const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express();
app.set('view engine', 'ejs')
const corsOptions = {
    origin: 'http://127.0.0.1:5501',
    credentials: true
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors(corsOptions))
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
    library: [{
        title: {
            type: String,
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
    }],
    role: {
        type: String,
        required: true
    }
});

const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/user/:id', (req, res) => {
    const token = req.cookies.jwt
    if (token === undefined) return res.status(403).redirect('/')
    res.render('home')
})

app.get('/api/library', async (req, res) => {
    const library = await Book.find();
    return res.json(library);
})

app.get('/userlibrary', (req, res) => {
    const token = req.cookies.jwt
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.send(err)
        const currentUser = await User.find({ username: user.username })
        // const library = currentUser[0]._docs.library 
        res.send({ data: currentUser[0].library })
    })
})

app.get('/api/userdata', (req, res) => {
    const token = req.cookies.jwt
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.send(err)
        const currentUser = await User.find({ username: user.username })
        res.send(currentUser)
    })
})

app.get('/user/:id/library', async (req, res) => {
    const { id } = req.params
    const { title, author, cover } = req.body
    let readStatus = false
    let favoriteStatus = false
    let user = await User.findById({_id: id})
    let book = { title, author, cover, readStatus, favoriteStatus }
    user.library.push(book)
    await user.save()
    res.send({message: 'successfully updated'})
})

app.put('/logout', (req, res) => {
    res.clearCookie('jwt').status(200).end()
})

app.put('/user/:id/library', async (req, res) => {
    const { id } = req.params
    const { title, author, cover } = req.body
    let readStatus = false
    let favoriteStatus = false
    let user = await User.findById({_id: id})
    let book = { title, author, cover, readStatus, favoriteStatus }
    user.library.push(book)
    await user.save()
    res.end()
})

app.put('/user/:id/library/book', async (req, res) => {
    const { id } = req.params
    const { _id, title, author, cover, readStatus, favoriteStatus } = req.body
    const user = await User.findById({_id: id})
    const book = user.library.id(_id)
    book.title = title
    book.author = author
    book.cover = cover
    book.readStatus = readStatus
    book.favoriteStatus = favoriteStatus
    await user.save()
    res.end()
})

app.put('/user/:id/library/book/delete', async (req, res) => {
    const { id } = req.params
    const { _id, title, author, cover, readStatus, favoriteStatus } = req.body
    const user = await User.findById({_id: id})
    user.library.id(_id).deleteOne()
    await user.save()
    res.end()
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
    const users = await User.find()
    if (users.filter(user => user.username === username).length === 1) {
        return res.send(true)
    }
    const securePassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, securePassword, role: 'basic'});
    user.save()
    return res.send(user._id)
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.find({ username: username })
    
    if (user.length === 0) {
        res.send({ message: "Incorrect username and/or password" })
    } else {
        const match = await bcrypt.compare(password, user[0].securePassword);
        if (match) {
            const accessToken = jwt.sign({"username": user[0].username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300' })
            const refreshToken = jwt.sign({"username": user[0].username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
            res.cookie('jwt', refreshToken, { httpOnly: true,  sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 })
            res.send({ message: `Welcome back, ${username}`, accessToken: accessToken, id: user[0]._id})
        } else {
            res.send({ message: "Incorrect username and/or password" })
        }
    }
})

app.post('/api/refresh', async (req, res) => {
    const refreshToken = req.cookies.jwt
    if (!refreshToken) return res.status(401).json("You do not have the proper authorization")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        err && console.log(err)
        const newAccessToken = jwt.sign({"username": user.username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300' })
        const newRefreshToken = jwt.sign({"username": user.username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
        res.cookie('jwt', newRefreshToken, { httpOnly: true,  sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({ accessToken: newAccessToken })
    })
})

app.put('/user/:id', async (req, res) => {
    const { id } = req.params
    const { username, email } = req.body
    const user = await User.find({ username: username })
    if (username === user.username) 
    if (user.length === 1 && username !== user.username) {
        return res.send({ message: 'That username already exists'})
    }
    const editedUser = await User.findById(id)
    editedUser.username = username
    editedUser.email = email
    editedUser.save()
    return res.send({ message: 'Profile successfully updated' })
})

app.listen(8080, () => console.log('Server successfully started'))