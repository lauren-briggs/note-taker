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


// Get existing notes
app.get('/api/notes', (req, res) => {
    const data = fs.readFileSync("db/db.json", "utf8");
    res.status(200).send(JSON.parse(data));
})

// Post new notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

    // Set new notes id
    newNote.id = data.length;
    console.log(newNote.id);

    // Pushing new note onto data const
    data.push(newNote);
    // Writing db.json file with new data
    fs.writeFileSync("db/db.json", JSON.stringify(data));

    res.status(201).send(`Note created: "${newNote.title}`);
    console.log(`Note created: ${newNote.title}`);
})

app.get("/api/notes/:id", function (req, res) {
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    console.log("req.body.id: " + req.body.id);
    console.log(data[req.params.id]);
    res.json(data[req.params.id]);
});


app.delete("/api/notes/:id", function (req, res) {
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

    let id = req.params.id.toString();
    console.log(`ID to be deleted: ${id}`);

    console.log(data);
    let filteredData = data.filter(function (note) {
        return note.id != req.params.id;
    });

    console.log(filteredData);

    fs.writeFileSync("db/db.json", JSON.stringify(filteredData));
    console.log("note deleted");
    res.send(JSON.parse(filteredData));
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});