import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import ejsMate from "ejs-mate";

const app = express();
const port = 3021;
const API_URL_SEARCH = "https://openlibrary.org/search.json?q="
const API_URL_COVER = "https://covers.openlibrary.org/b/isbn/" // + isbnID + "-M.jpg" - to display medium size picture

// initialize middlewares
app.engine('ejs', ejsMate);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});