const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // enables CORS to allow requests from the frontend
app.use(express.json()); 

//sample notes
let notes = [
  { id: 1, content: 'This is a sample note', important: true },
  { id: 2, content: 'Another note here', important: false }
];

// generate new unique ID for new notes
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
  return maxId + 1; // returns a new ID that is one greater than the current maximum ID
};

// get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// add a new note
app.post('/api/notes', (req, res) => {
  const { content, important } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  const newNote = {
    id: generateId(),
    content,
    important: important || false
  };

  notes = [...notes, newNote];
  res.status(201).json(newNote);
});

// delete a note by id
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
});

// edit/update a note by id
app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const updatedNote = req.body; // gets the updated note data from the request body

  notes = notes.map(note => (note.id === id ? { ...note, ...updatedNote } : note));
  const editedNote = notes.find(note => note.id === id);

  if (editedNote) {
    res.json(editedNote);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
