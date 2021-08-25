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

app.post("/gia-xang", async (req, res) => {
    crawler.LayGiaXang().then(result => {
        let objRes = {
            data: [
                {
                    message: "Giá xăng 92: " + result.gia_xang_92 + " vnđ\nGiá xăng 95: " + result.gia_xang_95 + " vnđ"
                }
            ]
        }
        res.json(objRes);
    }).catch(() => {
        res.status(500).send("Da co loi xay ra");
    })
});

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
});