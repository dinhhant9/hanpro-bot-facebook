const express = require("express");
const request = require('request');
const moment = require('moment');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
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
        if (index < 10) objRes.data.push({ message: item.title })
    })

    res.json(objRes);
});

app.post("/thoi-tiet", async (req, res) => {
    request.get('https://api.openweathermap.org/data/2.5/weather?q=Quy%20Nhon&lang=vi&appid=cca17b8c0e40be90211345a325ea8151', function (error, response, body) {
        console.log('body:', JSON.parse(body));
        let objBody = JSON.parse(body)
        let message = "Thời tiết Quy Nhơn: " + (objBody.main.temp - 273.15).toFixed(0) + "°C, " + objBody.weather[0].description
        sendResponse(res, message)
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

    let message = "Còn " + Math.abs(diff) + " ngày nữa nhận lương (" + b.format("DD/MM/YYYY") + ")"
    sendResponse(res, message)
});

app.post("/gia-xang", async (req, res) => {
    crawler.LayGiaXang().then(result => {
        let message = "Giá xăng 92: " + result.gia_xang_92 + " vnđ\nGiá xăng 95: " + result.gia_xang_95 + " vnđ"
        sendResponse(res, message);
    }).catch(() => {
        sendResponse(res, "Lỗi không lấy được giá xăng");
    })
});

app.post("/ai", async (req, res) => {
    let message = req.body.senderMessage.trim().toLowerCase()

    if (isItemInArrayContainsInString(['noel', 'giáng sinh', 'xmas', 'christmas'], message)) {
        var a = moment();
        var b = moment([a.year(), 11, 24]);
        let diff = b.diff(a, 'days')

        if (diff < 0) {
            b = moment([a.year() + 1, 11, 24]);
        }

        diff = b.diff(a, 'days')

        let message = "Sắp tới Noel: " + Math.abs(diff) + " ngày nữa"
        sendResponse(res, message)
        return
    }

    if (isItemInArrayContainsInString(['năm mới', 'hết năm', 'tết tây', 'new year'], message)) {
        var a = moment();
        var b = moment([a.year() + 1, 0, 1]);
        let diff = b.diff(a, 'days')

        let message = "Còn " + Math.abs(diff) + " ngày nữa nết năm " + a.year()
        sendResponse(res, message)
        return
    }

    if (isItemInArrayContainsInString(['cảm ơn', 'thank you', 'tạm biệt', 'goodbye'], message)) {
        let message = "Cảm ơn bạn"
        sendResponse(res, message)
        return
    }

    if (isItemInArrayContainsInString(['xin chào', 'hello', 'chào bạn', 'chào'], message)) {
        let message = "Xin chào bạn"
        sendResponse(res, message)
        return
    }

    if (isItemInArrayContainsInString(['không?', 'k?', 'ko?'], message)) {
        let messageArr = ['Có', 'Không']
        let random = messageArr[Math.floor(Math.random() * messageArr.length)]
        sendResponse(res, random)
        return
    }

    if (isItemInArrayContainsInString(['ai là', 'ai laf', 'ai la', 'who is'], message)) {
        let messageArr = ['Nai', 'Đon', 'Dương', 'Back', 'Quâng', 'Vương', 'Dance', 'Duck', 'Tiếng']
        let random = messageArr[Math.floor(Math.random() * messageArr.length)]
        sendResponse(res, "Là ông " + random)
        return
    }

    if (isItemInArrayContainsInString(['xin phép', 'xin phep'], message)) {
        let messageArr = ['Nai', 'Đon', 'Dương', 'Back', 'Quâng', 'Vương', 'Dance', 'Duck', 'Tiếng']
        let random = messageArr[Math.floor(Math.random() * messageArr.length)]
        sendResponse(res, "Djt cm ông " + random)
        return
    }

    if (isItemInArrayContainsInString(['làm gì', 'làm gi', 'lam gì', 'lam gi'], message)) {
        let messageArr = ['rửa đít', 'ỉa', 'rặn', 'lứng', 'sc', 'nhậu', 'chơi đỉ', 'massage', 'bắn', 'chụp hình nude', 'cởi chuồng', 'sóc lọ', 'cống hiến cho công ty lớn', 'chat sẽ', 'xem phim heo', 'xem sẽ gầy', 'tét đít', 'mân mê con cu', 'cạo lông chim', 'bóp dái', 'chụp ảnh cu', 'bôi dầu gió vào cu']
        let random = messageArr[Math.floor(Math.random() * messageArr.length)]
        sendResponse(res, "Đang " + random)
        return
    }


    res.send("Han pro");

});

function isItemInArrayContainsInString(array, string) {
    for (let i = 0; i < array.length; i++) {
        if (string.includes(array[i])) {
            return true;
        }
    }
    return false;
}

function sendResponse(res, message) {
    let objRes = {
        data: [
            {
                message: message
            }
        ]
    }
    res.json(objRes);
}

app.listen(port, () => {
    console.log("Server started on http://localhost:" + port);
});
