const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { read } = require('fs');

const app = express();


app.use(express.json());
app.use(cors());

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
    imgsrc: {
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
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})
  
const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);


// run();
// async function run() {
//     try {
//         const newUser = new User({ username: "joshua2", email: "joshua2@email.com", password: "2"})
//         newUser.save();
//         console.log(newUser);
        // const book = await Book.where('readStatus').equals('true');
        // console.log(book);

//     } catch (error) {
//         console.log(error.message);
//     }
// }

app.get('/api/library', async (req, res) => {
    const library = await Book.find();
    res.json(library);
})

app.post('/api/library', (req, res) => {
    const { title, author, imgsrc, readStatus, favoriteStatus } = req.body
    const book = new Book({ title, author, imgsrc, readStatus, favoriteStatus });
    book.save();
    res.end();
})

app.put('/api/library/:id', async (req, res) => {
    const { id } = req.params;
    await Book.replaceOne({_id: id}, req.body);
    res.end();
})

app.delete('/api/library/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    res.end();
})

app.post('/api/users', (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body); 
    const user = new User({username, email, password});
    user.save();
    res.end();
})

app.listen(8080, () => console.log('Server successfully started'))