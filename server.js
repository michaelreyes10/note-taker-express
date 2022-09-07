// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");


// Handling Async Processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// Server setup
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Static Middleware
app.use(express.static("public"));


// API Route | "GET" request
app.get("/api/notes", function(req, res) {
  readFileAsync("db/db.json", "utf8").then(function(data) {
      notes = [].concat(JSON.parse(data))
      res.json(notes);
    })
}); 


// API Route | "POST" request
app.post("/api/notes", function(req, res) {
    const theNote = req.body;
    readFileAsync("db/db.json", "utf8").then(function(data) {
      const theNotes = [].concat(JSON.parse(data));
      theNote.id = theNotes.length + 1
      theNotes.push(theNote);
      return theNotes
    }).then(function(notes) {
      writeFileAsync("db/db.json", JSON.stringify(notes))
      res.json(theNote);
    })
});


// API Route | "DELETE" request
app.delete("/api/notes/:id", function(req, res) {
  const deleteID = parseInt(req.params.id);
  readFileAsync("db/db.json", "utf8").then(function(data) {
    const notes = [].concat(JSON.parse(data));
    const newNotes = []
    for (let i = 0; i<notes.length; i++) {
      if(deleteID !== notes[i].id) {
        newNotes.push(notes[i])
      }
    }
    return newNotes
  }).then(function(notes) {
    writeFileAsync("db/db.json", JSON.stringify(notes))
    res.send('saved success!!!');
  })
})


// HTML Routes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function(req, res) {
     res.sendFile(path.join(__dirname, "/public/index.html"));
});

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});


