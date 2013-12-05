var pwd = require('path').resolve('.'),
    express = require('express'),
    fs = require('fs'),
    base64 = require('base64-stream'),
    app = express();

app.use(express.static(pwd), express.directory(pwd));

app.post('/images/:filename', function(req, res) {
    var fileStream = fs.createWriteStream(req.params.filename);
    fileStream.on('finish', function () {
        res.send(201);
    });
    req.on('error', function () {
        res.send(500);
    });
    req.pipe(base64.decode()).pipe(fileStream);
});

app.listen(8000);

console.log('Listening - open http://localhost:8000/shrink.html to have a look');
