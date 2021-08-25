const express = require("express");
const request = require('request');
const moment = require('moment');
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

app.post("/tin-tuc", async (req, res) => {
    let feed = await parser.parseURL('https://vnexpress.net/rss/tin-moi-nhat.rss');
    let objRes = {
        data: []
    }
    feed.items.forEach((item, index) => {
        if (index < 10) objRes.data.push({message: item.title})
    })

    res.json(objRes);
});

app.post("/thoi-tiet", async (req, res) => {
    request.get('https://api.openweathermap.org/data/2.5/weather?q=Quy%20Nhon&lang=vi&appid=cca17b8c0e40be90211345a325ea8151', function (error, response, body) {
        console.log('body:', JSON.parse(body));
        let objBody = JSON.parse(body)
        let objRes = {
            data: [
                {
                    message: "Thời tiết Quy Nhơn: " + (objBody.main.temp - 273.15).toFixed(0) + "°C, " + objBody.weather[0].description
                }
            ]
        }
        res.json(objRes);
    });
});

app.post("/luong", async (req, res) => {
    let a = moment();

    let b = moment().set("date", 5);

    let dayOfMonth = a.date();

    console.log(dayOfMonth);

    if (dayOfMonth > 5) {
        b = b.add(1, 'M')
    }

    let dayOfWeek = b.day()
    if (dayOfWeek === 0) {
        b = b.set("date", 6);
    }
    if (dayOfWeek === 6) {
        b = b.set("date", 4);
    }

    

    let diff = a.diff(b, 'days')

    let objRes = {
        data: [
            {
                message: "Còn " + Math.abs(diff) + " ngày nữa nhận lương (" + b.format("DD/MM/YYYY") + ")"
            }
        ]
    }
    res.json(objRes);
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