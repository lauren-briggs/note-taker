const express = require('express');
const fs = require('fs');
// const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(express.static('public'));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/api/notes', (req, res) => {
    const data = fs.readFileSync("db/db.json", "utf8");
    res.status(200).send(JSON.parse(data));
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const data = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    data.push(newNote);
    fs.writeFileSync("db/db.json", JSON.stringify(data));
    res.status(201).send("Note created");
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

