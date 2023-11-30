import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import ejsMate from "ejs-mate";

const app = express();
const port = 3021;
const API_URL_SEARCH = "https://openlibrary.org/search.json?limit=10&q="
const API_URL_COVER = "https://covers.openlibrary.org/b/isbn/" // + isbnID + "-M.jpg" - to display medium size picture

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

app.post("/submit", async (req, res) => {
    const searchQuery = req.body["searchQuery"];

    try {
        const response = await axios.get(API_URL_SEARCH + searchQuery);
        const data = response.data.docs;
        res.render("index.ejs", { data });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});