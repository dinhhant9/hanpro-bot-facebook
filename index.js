const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());

const crawler = require("./crawler")

let Parser = require('rss-parser');
let parser = new Parser();

app.get("/", async (req, res) => {
    res.send("Han pro");
});

app.get("/tin-tuc", async (req, res) => {
    let feed = await parser.parseURL('https://vnreview.vn/feed/-/rss/home');
    res.json(feed);
});

app.get("/thoi-tiet", async (req, res) => {
    let feed = await parser.parseURL('https://vnreview.vn/feed/-/rss/home');
    res.json(feed);
});

app.get("/gia-xang", async (req, res) => {
    crawler.LayGiaXang().then(result => {
        res.json(result);
    }).catch(() => {
        res.status(500).send("Da co loi xay ra");
    })
});

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
});