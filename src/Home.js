import React, { useState, useEffect } from 'react';

const Home = () => {
    const [notes, setNotes] = useState([]);  // store notes
    const [inputValue, setInputValue] = useState(''); // input field   
    const [editingNoteId, setEditingNoteId] = useState(null);  // note being edited

    // fetch notes from the backend when the component mounts
    useEffect(() => {
        fetch('http://localhost:3001/api/notes')  // backend URL to fetch notes
            .then(response => response.json())
            .then(data => setNotes(data))  // set the notes from the backend
            .catch(error => console.error('Error fetching notes:', error));
    }, []);  // empty dependency array [] means this runs once when component mounts

    const handleInputChange = (event) => {
        setInputValue(event.target.value);  
    };

    const handleAddNote = () => {
        if (inputValue.trim()) {
            const newNote = {
                content: inputValue,
                important: false,
            };

            // send POST request to add a new note to the backend
            fetch('http://localhost:3001/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            })
                .then(response => response.json())
                .then(addedNote => {
                    setNotes([...notes, addedNote]);  // add the new note to the existing list
                    setInputValue('');  // clear the input field
                })
                .catch(error => console.error('Error adding note:', error));
        }
    };

    const handleDeleteNote = (id) => {
        fetch(`http://localhost:3001/api/notes/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            setNotes(notes.filter(note => note.id !== id));  // remove the deleted note from state
        })
        .catch(error => console.error('Error deleting note:', error));
    };

    const handleEditNote = (id) => {
        if (inputValue.trim()) {
            const updatedNote = {
                content: inputValue,  // update the content from input field
                important: false,  
            };

            // send PUT request to update the note in the backend
            fetch(`http://localhost:3001/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNote),
            })
                .then(response => response.json())
                .then(editedNote => {
                    setNotes(notes.map(note => (note.id === id ? editedNote : note)));  // update the note in the state
                    setInputValue('');  // clear the input field
                    setEditingNoteId(null);  // reset the editing state
                })
                .catch(error => console.error('Error editing note:', error));
        }
    };

    const startEditing = (id, content) => {
        setEditingNoteId(id);  // set the note ID for editing
        setInputValue(content);  // set the current content in the input field for editing
    };

    return (
        <div className="home">
            <h1>Note-Taking App</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {notes.map((note) => (
                    <li key={note.id}>
                        {note.content}
                        <button onClick={() => handleDeleteNote(note.id)}> Delete </button>
                        <button onClick={() => startEditing(note.id, note.content)}> Edit </button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Add or edit a note"
            />
            {editingNoteId ? (
                <button onClick={() => handleEditNote(editingNoteId)}>Update Note</button>
            ) : (
                <button onClick={handleAddNote}>Add Note</button>
            )}
        </div>
    );
};

export default Home;
