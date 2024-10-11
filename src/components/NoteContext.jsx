import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const NoteContext = createContext({
 
  selectedGroup: null,
  notes: [],
  setSelectedGroup: () => { },
  addGroup: () => { },
  addNote: () => { },
  updateNote: () => { }
});

export const NoteProvider = ({ children }) => {
  const [groups, setGroups] = useLocalStorage('noteGroups', []);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notes, setNotes] = useLocalStorage(`notes_${selectedGroup?.id}`, []);

  useEffect(() => {
    try {
      const savedGroups = JSON.parse(localStorage.getItem('noteGroups')) || [];
      setGroups(savedGroups);
      if (savedGroups.length > 0) {
        setSelectedGroup(savedGroups[0]);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      setGroups([]);
      setSelectedGroup(null);
    }
  }, []);

useEffect(() => {
  if (groups.length > 0) {
    localStorage.setItem('noteGroups', JSON.stringify(groups));
  }
}, [groups]);

useEffect(() => {
  if (selectedGroup) {
    const savedNotes = JSON.parse(localStorage.getItem(`notes_${selectedGroup.id}`)) || [];
    setNotes(savedNotes);
  }
  else {
    setNotes([]); 
  }
}, [selectedGroup]);


  // useEffect(() => {
  //   localStorage.setItem('noteGroups', JSON.stringify(groups));
  // }, [groups]);

  // useEffect(() => {
  //   if (selectedGroup) {
  //     const savedNotes = JSON.parse(localStorage.getItem(`notes_${selectedGroup.id}`)) || [];
  //     setNotes(savedNotes);
  //   }
  // }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup && notes.length > 0) {
      localStorage.setItem(`notes_${selectedGroup.id}`, JSON.stringify(notes));
    }
  }, [notes, selectedGroup]);

      const getGroupInitials = (name) => {
        const words = name.split(' ').filter(word => word);
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase(); 
        } else {
            return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase(); 
        }
    };

  const addGroup = (groupName, color) => {
    if (groupName.trim() !== "") {
      const initials = getGroupInitials(groupName);
    const newGroup = {
      // id: Date.now(),
      id:`group_${Date.now()}`,
      name: groupName,
      color: color,  
      initials: initials,
      createdAt: new Date().toISOString(),
    };
    // setGroups([...groups, newGroup]);
    setGroups(prevGroups => [...prevGroups, newGroup]); 
  }
  };

  const addNote = (content) => {
    if (!selectedGroup) return;
    
    const newNote = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (noteId, newContent) => {
    if(!selectedGroup || !notes) return;

    const updatedNotes = notes.map((note) => {
      if (!note || note.id !== noteId) return note;
    
    return {
      ...note,
      content: newContent,
      updatedAt: new Date().toISOString()
    };
  });
  
  setNotes(updatedNotes);
};

  return (
    <NoteContext.Provider 
      value={{ 
        groups, 
        selectedGroup, 
        notes, 
        setSelectedGroup, 
        addGroup, 
        addNote,
        updateNote
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => useContext(NoteContext);
