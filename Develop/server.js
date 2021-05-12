const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Initial get index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Initial get notes.html
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


// Get existing notes - read db.json file
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
    // Pushing new note onto data const
    data.push(newNote);
    // Writing db.json file with new data
    fs.writeFileSync("db/db.json", JSON.stringify(data));
    res.status(201).send(`Note created: "${newNote.title}`);
    console.log(`Note created: ${newNote.title}`);
})

// Get note by id to render on click
app.get("/api/notes/:id", function (req, res) {
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    console.log("req.body.id: " + req.body.id);
    res.json(data[req.params.id]);
});

// Get note by id for deletion
app.delete("/api/notes/:id", function (req, res) {
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

    let id = req.params.id.toString();
    console.log(`Note ID to be deleted: ${id}`);

    // Filtering the notes against the condition of matching the selected ID
    let filteredData = data.filter(function (note) {
        return note.id != req.params.id;
    });

    fs.writeFileSync("db/db.json", JSON.stringify(filteredData));
    console.log("Note deleted");
    res.send(filteredData);
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});