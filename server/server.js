import express, { json } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// import Schema below
import User from './Schema/User.js';
import Book from './Schema/Book.js';

const server = express();
let PORT = 3000;

// middleware
server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
});

const verifyJWT = (req, res, next) => {
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ "error": "No access token" })
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ "error": "Access token is invlaid" })
        }

        req.user = user.id;
        next();
    })
}

const formatDataToSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let usernameExists = await User.exists({ "personal_info.username": username }).then(result => result)

    usernameExists ? username += nanoid().substring(0, 3) : "";

    return username;
}

server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 letters long" })
    }

    if (!email.length) {
        return res.status(403).json({ "error": "Enter email" })
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, username, password: hashed_password }
        })

        user.save().then((u) => {
            return res.status(200).json(formatDataToSend(u))
        })
            .catch(err => {

                if (err.code == 11000) {
                    return res.status(500).json({ "error": "Email already exist" })
                }

                return res.status(500).json({ "error": err.message })
            })
    })
})

server.post("/signin", (req, res) => {
    let { email, password, secretcode } = req.body;

    secretcode == "~inmasdmch" &&
        User.findOne({ "personal_info.email": email })
            .then((user) => {

                if (!user) {
                    return res.status(403).json({ "error": "Email not found" })
                }

                bcrypt.compare(password, user.personal_info.password, (err, result) => {
                    if (err) {
                        return res.status(403).json({ "error": "Error occured while login please try again!" })
                    }

                    if (!result) {
                        return res.status(403).json({ "error": "Incorrect password" })
                    } else {
                        return res.status(200).json(formatDataToSend(user))
                    }
                })
            })
            .catch(err => {
                return res.status(403).json({ "error": err.message })
            })
})


server.post('/latest-books', (req, res) => {
    let { page } = req.body;

    let maxLimit = 8;

    Book.find({ draft: false })
        .sort({ "publishedAt": -1 })
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(books => {
            return res.status(200).json({ books })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

server.post("/all-latest-books-count", (req, res) => {
    Book.countDocuments({ draft: false })
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

server.post("/search-books", (req, res) => {
    let { tag, query, author, page, limit, eliminate_book } = req.body;

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false, book_id: { $ne: eliminate_book } };
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
    } else if (author) {
        findQuery = { author, draft: false };
    }

    let maxLimit = limit ? limit : 5;

    Book.find(findQuery)
        .sort({ "publishedAt": -1 })
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(books => {
            return res.status(200).json({ books })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

server.post("/search-books-count", (req, res) => {
    let { tag, author, query } = req.body;

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
    } else if (author) {
        findQuery = { author, draft: false };
    }

    Book.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})


server.post('/create-book', verifyJWT, (req, res) => {
    let authorId = req.user;
    let { title, des, serial, tags, content, writer, type, photo, draft, id } = req.body;

    if (!title.length) {
        return res.status(403).json({ "error": "You must provide a tittle to publish book" })
    }

    tags = tags.map(tag => tag.toLowerCase());

    let book_id = id || title.replace(/[^a-zA-Z0-9]/g).replace(/\s+/g, "-").trim() + nanoid();

    let book = new Book({
        title, des, serial, content, tags, writer, type, photo, author: authorId, book_id, draft: Boolean(draft)
    })

    book.save().then(book => {
        res.status(200).json({ book })
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })

})

server.post("/get-book", (req, res) => {

    let { book_id, draft } = req.body;


    Book.findOne({ book_id })
        .then(book => {
            return res.status(200).json({ book })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

server.listen(PORT, () => {
    console.log("Listening on port" + PORT);
})