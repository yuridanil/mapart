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
    database: 'mapart'
});

// Creating a GET route that returns data from the 'users' table.
app.get('/images', function (req, res) {
    connection.getConnection(function (err, connection) {
        let sql = "SELECT concat('uploads/', id, '.jpg') as original, concat('uploads/', id, '.jpg') as thumbnail,"
            + " title as originalTitle"
            + " FROM images order by id desc";
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    });
});

const getFilename = () => { }

const storage = multer.diskStorage({
    destination: "./uploads",
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
        let options = { percentage: 20 };
        imageThumbnail('uploads/' + req.file.filename, options)
        .then(thumbnail => {
            fs.writeFile('uploads/thumbs/' + req.file.filename, thumbnail, function (err) {
                if (err) throw err;
                console.log('Replaced!');
              });
        })
        .catch(err => console.error(err));
        console.log("Файл загружен");
        res.send({"result": "ok", "filename": req.file.filename});
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

