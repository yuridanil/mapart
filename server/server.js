const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const cors = require("cors");
const imageThumbnail = require('image-thumbnail');

// Starting our app.
const app = express();
app.use(cors());

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'mapart',
    connectionLimit : 100
});

// Creating a GET route that returns data from the 'users' table.
app.get('/images', function (req, res) {
    console.log('get images')
    connection.getConnection(function (err, connection) {
        let sql = "SELECT id, title, `desc`, lat, lng, zoom, bearing, user_id, filters, likes, shown, width, height, category, tags,"
            + " concat(id, '.jpg') as filename, concat('uploads/', id, '.jpg') as original, concat('uploads/thumbs/', id, '.jpg') as thumbnail"
            + " FROM images order by id desc";
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    });
});

const getFilename = () => { }

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename (req, file, callback) {
        let o = JSON.parse( decodeURI(file.originalname));
        connection.getConnection(function (err, connection) {
            connection.query('INSERT INTO images SET ?', {
                user_id: o.user_id,
                title: o.title,
                desc: decodeURI(o.desc),
                lat: o.lat,
                lng: o.lng,
                zoom: o.zoom,
                bearing: o.bearing,
                width: o.width,
                height: o.height,
                filters: o.filters
            }, function (error, results, fields) {
                if (error)
                    throw error;
                callback(null, results.insertId.toString() + '.jpg');
            });
        });
    }
});


const upload = multer({ storage })

app.post('/upload', upload.single('filedata'), (req, res) => {

    console.log(req.file.filename);
    let filedata = req.file;

    if (!filedata) {
        console.log("Ошибка при загрузке файла");
        res.send("Ошибка при загрузке файла");
    }

    else {
        let options = { width: 300, height: 300, fit: "inside" };
        imageThumbnail('public/uploads/' + req.file.filename, options)
        .then(thumbnail => {
            fs.writeFile('public/uploads/thumbs/' + req.file.filename, thumbnail, function (err) {
                if (err) throw err;
                console.log('Replaced!');
              });
        })
        .catch(err => console.error(err));
        console.log("Файл загружен");
        console.log(path.parse(req.file.filename).name);
        res.send({"result": "ok", "filename": req.file.filename, "id": path.parse(req.file.filename).name});
    }
})

// Starting our server.
app.listen(3001, () => {
    console.log('Go to http://localhost:3001/images so you can see the data.');
});

// request handlers
/*
app.get('/', (req, res) => {
    var sql;

    sql = "select * from images order by id desc limit 10";

    var query = db.query(sql, function (err, result) {
        if (err) {
            return res.send({ message: err });
        } else {
            return res.send(result);
        }
    });

});
*/

/*
https://www.npmjs.com/package/image-thumbnail
image-thumbnail options:
percentage [0-100] - image thumbnail percentage. Default = 10
width [number] - image thumbnail width.
height [number] - image thumbnail height.
responseType ['buffer' || 'base64'] - response output type. Default = 'buffer'
jpegOptions [0-100] - Example: { force:true, quality:100 }
fit [string] - method by which the image should fit the width/height. Default = contain (details)
failOnError [boolean] - Set to false to avoid read problems for images from some phones (i.e Samsung) in the sharp lib. Default = true (details)
withMetaData [boolean] - Keep metadata in the thumbnail (will increase file size)
flattenBackgroundColor [background colour] - parsed by the color module, defaults to #ffffff.
*/