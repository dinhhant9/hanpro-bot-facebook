const cheerio = require('cheerio')
const request = require('request-promise')

function LayGiaXang() {
    return new Promise(function (resolve, reject) {
        request('https://www.pvoil.com.vn/truyen-thong/tin-gia-xang-dau', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let arr = []
                $('.filter-wrapper tbody').each((index, table) => {
                    $(table).find('tr').each((index, tr) => {
                        $(tr).find('td').each((index, td) => {
                            const content = $(td).text();
                            arr.push(content)
                        })
                    })
                })

                let obj = {
                    gia_xang_95: arr[2],
                    gia_xang_92: arr[6]
                }
                resolve(obj)
            } else {
                reject()
            }
        });
    })
}

module.exports = {
    LayGiaXang,
};