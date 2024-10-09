import React, { useState, useEffect, useRef } from "react";
import { useNotes } from "./NoteContext.jsx";
import img from "../assets/centerimage.png";
import "./styles.css";

export const NoteInput = () => {
  const { addNote } = useNotes();
  const [newNote, setNewNote] = useState("");
  const noteListRef = useRef(null);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(newNote);
    setNewNote("");
    if (noteListRef.current) {
      noteListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="note-input-container">
      <textarea 
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Enter your text here..."
        className="inputtext"
        onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
      />
      <button onClick={handleAddNote} disabled={newNote.trim().length === 0}
        className={newNote.trim().length > 0 ? "enabled" : ""} style={{position:'fixed', bottom:'20px',
         right:'20px', background:'none',border:'none', rotate:'1deg'}}>
       
        <svg
          width="35"
          height="29"
          viewBox="0 0 35 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 29V18.125L14.5 14.5L0 10.875V0L34.4375 14.5L0 29Z"
            fill={newNote.trim().length > 0 ? "#0000FF" : "#ABABAB"}
          />
        </svg>
      </button>
    </div>
  );
};

export const NoteList = () => {
  const { notes, updateNote } = useNotes();
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const noteListRef =useRef(null);
  const handleEditClick = (note) => {
    if (!note || !note.id) return;
    setEditingNoteId(note.id);
    setEditedContent(note.content);
  };

  const handleSaveEdit = (noteId) => {
    if (!noteId) return;
    updateNote(noteId, editedContent);
    setEditingNoteId(null);
    setEditedContent("");
  };

  useEffect(() => {
    if (noteListRef.current) {
      noteListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes]);

  if (!notes || notes.length === 0) {
    return ;
  }
  return (
    <div className="notes-list">
      {notes?.map((note) => {
        if (!note || !note.id) return null;

        return (
          <div key={note.id} className="note-item">
            {editingNoteId === note.id ? (
              <div className="note-edit-container">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="note-edit-textarea"
                />

                <button
                  onClick={() => handleSaveEdit(note.id)}
                  className="note-save-button"
                >
                  <svg
                    width="35"
                    height="29"
                    viewBox="0 0 35 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 29V18.125L14.5 14.5L0 10.875V0L34.4375 14.5L0 29Z"
                      fill={"#ABABAB" }
                    />
                    
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => handleEditClick(note)}
                className="note-content"
              >
                <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
                <div className="note-timestamp">
                  {note.updatedAt !== note.createdAt
                    ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
                    : `Created: ${new Date(note.createdAt).toLocaleString()}`}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={noteListRef} /> 
    </div>
  );
};

export const NotesSection = () => {
  const { selectedGroup, setSelectedGroup } = useNotes();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackClick = () => {
    setSelectedGroup(null);

    document.querySelector('.notes-container').classList.remove('visible');
    document.querySelector('.sidebar').classList.remove('hidden');
  };


  if (!selectedGroup) {
    return (
      <div className="empty-notes-container">
        <div className="empty-notes-content">
          <div className="empty-notes-image">
            <img src={img} alt="notesimage" className="centerimg" />
          </div>
          <div className="empty-notes-text">
            <h3 className="rightsideh3">Pocket Notes</h3>
            <p className="rightsideh5">
              Send and receive messages without keeping your phone online.
              <br />
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone.
            </p>
          </div>
          <p className="encryption-text">
            <span role="img" aria-label="lock">
              🔒
            </span>{" "}
            end-to-end encrypted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`notes-container ${selectedGroup ? 'visible' : ''}`}>
        
          <div className="notes-header" style={{ backgroundColor: "#001F8B" }}>
            {isMobile && (
              <button className="back-button" onClick={handleBackClick}>
                ← 
              </button>
            )}
            <div
              className="initial-circle"
              style={{
                backgroundColor: selectedGroup.color,
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "25px",
                marginLeft: isMobile ? "3rem" : "10px",
              }}
            >
              {selectedGroup.initials}
            </div>
            <span
              className="group-name"
              style={{
                marginLeft: "10px",
                color: "white",
                fontSize: "28px",
              }}
            >
              {selectedGroup.name}
            </span>
          </div>

          <NoteList />
          <NoteInput />
    </div>
  );
};
