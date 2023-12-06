import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import ejsMate from "ejs-mate";

const app = express();
const port = 3021;
const API_URL_SEARCH = "https://openlibrary.org/search.json?limit=10&q="
const API_URL_COVER = "https://covers.openlibrary.org/b/isbn/" // + isbnID + "-M.jpg" - to display medium size picture

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "mypassword",
    port: 5432
});
db.connect();

// initialize middlewares
app.engine('ejs', ejsMate);
/* app.use(express.static("public")); */
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const data = [{
        title: '',
        first_publish_year: '',
        isbn: [],
        author_name: []
    }];
    res.render("index.ejs", { data });
})

app.get("/submit", (req, res) => {
    res.redirect("/");
})

app.get("/books", async (req, res) => {
    const result = await db.query("SELECT * FROM collections");
    const collections = result.rows;

    res.render("collections.ejs", { data: collections });
})

app.post("/submit", async (req, res) => {
    const searchQuery = req.body["searchQuery"];

    try {
        const response = await axios.get(API_URL_SEARCH + searchQuery);
        const data = response.data.docs;
        res.render("index.ejs", { data, searchQuery });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/books", async (req, res) => {
    res.send("form submitted!");

    const item = req.body.book.title;
    console.log(item);
    /* try {
        await db.query(
            "INSERT INTO items(title) VALUES($1)",
            [item]
        );
    } catch (err) {
        console.log(err);
    }
    res.redirect("/"); */
})

app.post("/books/new", (req, res) => {
    const book = req.body.book;
    res.render('new.ejs', { book });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});