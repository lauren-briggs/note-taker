const express = require('express');
const fs = require('fs');
const path = require('path');
// const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;

app.use(express.static('public'));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});



app.get('/api/notes', (req, res) => {
    const data = fs.readFileSync("db/db.json", "utf8");
    res.status(200).send(JSON.parse(data));
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    // Pushing new note onto data const
    data.push(newNote);
    // Writing db.json file with new data
    fs.writeFileSync("db/db.json", JSON.stringify(data));
    res.status(201).send(`Note created: "${newNote.title}`);
    console.log(`Note created: ${newNote.title}`);
})


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});


