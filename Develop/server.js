const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API route for getting notes
app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// API route for adding a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    const notes = readNotes();
    notes.push(newNote);

    writeNotes(notes);

    res.json(newNote);
});

// API route for deleting a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    let notes = readNotes();
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    if (notes.length !== updatedNotes.length) {
        writeNotes(updatedNotes);
        res.json({ message: 'Note deleted successfully.' });
    } else {
        res.status(404).json({ error: 'Note not found.' });
    }
});

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Function to read notes from db.json
function readNotes() {
    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
    return JSON.parse(data) || [];
}

// Function to write notes to db.json
function writeNotes(notes) {
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8');
}

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});