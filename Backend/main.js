const express = require("express");
const cors = require("cors")
const app = express();
app.use(express.static("assets/images"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

let productsData = require('./productsData')


app.get("/rubick", function (req, res) {

    let productsCount = productsData.length;
    let pageSize = 10;
    let pageCount = productsCount / pageSize;
    let page = parseInt(req.query.page)
    if (page < 1) {
        page = 1;
    }
    if (page > pageCount) {
        page = pageCount;
    }
    let startIndex = (page - 1) * pageSize
    let endIndex = page * pageSize
    if (endIndex < 0) { endIndex = 0 };

    let allProducts = productsData.slice(startIndex, endIndex);
    res.send({ productResults: allProducts, totalpage: pageCount });
})

app.delete('/rubick/delete', function (req, res) {
    var keys = req.body.keys;
    productsData = [...productsData.filter(tempdata => keys.indexOf(tempdata.key) < 0)];
    res.send(productsData);
})


app.listen(4000, function (err) {
    if (!err) {
        console.log("server running");
    }
});
