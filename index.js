import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import ejsMate from "ejs-mate";

const app = express();
const port = 3021;
const API_URL_SEARCH = "https://openlibrary.org/search.json?limit=10&q="
const API_URL_COVER = "https://covers.openlibrary.org/b/isbn/" // + isbnID + "-M.jpg" - to display medium size picture
let sort_by = "title";

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
    if (sort_by === "title") {
        const result = await db.query("SELECT *,TO_CHAR(CAST(read_date AS TIMESTAMP WITH TIME ZONE), 'MM/DD/YYYY') AS formatted_date FROM collections ORDER BY title");

        const collections = result.rows;
        res.render("collections.ejs", { data: collections, sort_by: sort_by });
    } else if (sort_by === "date") {
        const result = await db.query("SELECT *,TO_CHAR(CAST(read_date AS TIMESTAMP WITH TIME ZONE), 'MM/DD/YYYY') AS formatted_date FROM collections ORDER BY read_date");

        const collections = result.rows;
        res.render("collections.ejs", { data: collections, sort_by: sort_by });
    } else {
        const result = await db.query("SELECT *,TO_CHAR(CAST(read_date AS TIMESTAMP WITH TIME ZONE), 'MM/DD/YYYY') AS formatted_date FROM collections ORDER BY rating desc");

        const collections = result.rows;
        res.render("collections.ejs", { data: collections, sort_by: sort_by });
    }


});

app.post("/books/sort", async (req, res) => {
    const sortBy = req.body.sort_by;
    sort_by = sortBy;
    /* sort_by = req.body.sort_by; */

    if (sort_by === "title") {
        const result = await db.query("SELECT *,TO_CHAR(CAST(read_date AS TIMESTAMP WITH TIME ZONE), 'MM/DD/YYYY') AS formatted_date FROM collections ORDER BY title");

        const collections = result.rows;
        res.render("collections.ejs", { data: collections, sort_by: sort_by });
    } else if (sort_by === "date") {
        const result = await db.query("SELECT *,TO_CHAR(CAST(read_date AS TIMESTAMP WITH TIME ZONE), 'MM/DD/YYYY') AS formatted_date FROM collections ORDER BY read_date");

        const collections = result.rows;
        res.render("collections.ejs", { data: collections, sort_by: sort_by });
    } else {
        const result = await db.query("SELECT *,TO_CHAR(CAST(read_date AS TIMESTAMP WITH TIME ZONE), 'MM/DD/YYYY') AS formatted_date FROM collections ORDER BY rating desc");

        const collections = result.rows;
        res.render("collections.ejs", { data: collections, sort_by: sort_by });
    }
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

    const title = req.body.book.title;
    const author_name = req.body.book.author_name;
    const first_publish_year = req.body.book.first_publish_year;
    const img_url = req.body.book.img_url;
    const rating = req.body.book.rating;
    const notes = req.body.book.notes;
    const readDate = req.body.book.readDate;

    try {
        await db.query(
            "INSERT INTO collections(img_url,title,read_date,rating,notes,author,first_publish_year) VALUES($1,$2,$3,$4,$5,$6,$7)",
            [img_url, title, readDate, rating, notes, author_name, first_publish_year]
        );
    } catch (err) {
        console.log(err);
    }
    res.redirect("/books");
})

app.post("/books/new", (req, res) => {
    const book = req.body.book;
    res.render('new.ejs', { book });
})

app.post("/books/update", (req, res) => {
    const book = req.body.book;
    console.log(book);
    res.render('update.ejs', { book });
});

app.post("/books/delete", async (req, res) => {
    const book = req.body.book;
    const id = book.id;

    try {
        await db.query(
            "DELETE FROM collections WHERE id = $1",
            [id]
        );

    } catch (err) {
        console.log(err);
    }
    res.redirect("/books");

});

app.post("/books/save", async (req, res) => {
    const rating = req.body.book.rating;
    const notes = req.body.book.notes;
    const id = req.body.book.id;

    try {
        await db.query(
            "UPDATE collections SET rating = $2,notes = $3 WHERE  id = $1",
            [id, rating, notes]
        );

    } catch (err) {
        console.log(err);
    }
    res.redirect("/books");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});