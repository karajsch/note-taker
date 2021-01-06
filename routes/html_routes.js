const fs = require('fs');
const path = require('path');

//when a note is added or subtracted the whole json file will update
function updateDb(notes) {
    fs.writeFile("db/db.json", JSON.stringify(notes, '\t'), err => {
        if (err) throw err;
        return true;
    });
}


module.exports = app => {

    fs.readFile("db/db.json", "utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        // this opens up the door for /api/notes to go through
        app.get("/api/notes", function (req, res) {
            //response will be in json
            res.json(notes);
        });

        //note payload via 'post'
        app.post("/api/notes", function (req, res) {

            let newNote = req.body;
            notes.push(newNote);
            updateDb(notes);
            res.json(notes)

        });
        // uses 'get' to find a note via the id
        app.get("/api/notes/:id", function (req, res) {

            res.json(notes[req.params.id]);
        });

        // uses 'delete' to delete a note via the id
        app.delete("/api/notes/:id", function (req, res) {
            notes.splice(req.params.id, 1);
            updateDb(notes);
            console.log("Deleted note with id " + req.params.id);
        });

        //this will display /notes.html to the user when they go to /notes
        app.get('/notes', function (req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        //"catcher's mitt" sends the user to index.html
        app.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });
    });

}