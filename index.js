import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3021;
const API_URL_SEARCH = "https://openlibrary.org/search.json?q="
const API_URL_COVER = "https://covers.openlibrary.org/b/isbn/" // + isbnID + "-M.jpg" - to display medium size picture

app.get("/", (req, res) => {
    res.send("Server is successfully running");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});