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

const pool = require('./db');
const SCHEMA = 'mapart';


// Creating a GET route that returns data from the 'users' table.
app.get('/images', async function (req, res) {
    console.log('get images');
    let sql = '', message = 'ok', status = 200, result, rows = [];

    try {
        sql = `SELECT id, title, "desc", lat, lng, zoom, bearing, user_id, filters, likes, shown, width, height, category, tags,
            concat(id, '.jpg') as filename, concat('uploads/', id, '.jpg') as original, concat('uploads/thumbs/', id, '.jpg') as thumbnail
            FROM ${SCHEMA}.images order by id desc`;
        result = await pool.query(sql, []);
    } catch (err) {
        status = 500;
        message = "unknownerror";
        console.log(err);
    } finally {
        res.status(status).json(result.rows);
    }
});

const getFilename = () => { }

const storage = multer.diskStorage({
    destination: "./build/uploads",
    filename(req, file, callback) {
        let o = JSON.parse(decodeURI(file.originalname));
        let sql = `INSERT INTO ${SCHEMA}.images (user_id, title, "desc", lat, lng, zoom, bearing, width, height, filters)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`;
        pool.query(sql, [
            o.user_id,
            o.title,
            o.desc,
            o.lat,
            o.lng,
            o.zoom,
            o.bearing,
            o.width,
            o.height,
            o.filters
        ], function (err, results) {
            if (err)
                throw err;
            callback(null, results.rows[0].id + '.jpg');
        });
    }
});

const upload = multer({ storage })

app.post('/upload', upload.single('filedata'), (req, res) => {

    console.log(req.file.filename);
    let filedata = req.file;

    if (!filedata) {
        console.log("Error uploading file");
        res.send({ "result": "error" });
    }

    else {
        let options = { width: 350, height: 350, fit: "inside" };
        imageThumbnail('./build/uploads/' + req.file.filename, options)
            .then(thumbnail => {
                fs.writeFile(__dirname + '/../build/uploads/thumbs/' + req.file.filename, thumbnail, function (err) {
                    if (err) throw err;
                    console.log('Thumb created');
                });
            })
            .catch(err => console.error(err));
        console.log("File uploaded. id=" + path.parse(req.file.filename).name);
        res.send({ "result": "ok", "filename": req.file.filename, "id": path.parse(req.file.filename).name });
    }
})

app.use(express.static('build'));

// Starting our server.
app.listen(8080, () => {
    console.log('Go to http://localhost:8080/ to open the App');
    console.log('Go to http://localhost:8080/images so you can see the data.');
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
