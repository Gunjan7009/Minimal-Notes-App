import React, { useState } from 'react';
import { NoteProvider } from './NoteContext';
import {Sidebar} from './Sidebar';
import { NotesSection } from './NotesSection';
import './styles.css';

const Home = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  return (
    <NoteProvider>
    <div className="app-container">
      <Sidebar />
      <NotesSection />
    </div>
  </NoteProvider>
  );
};

export default Home;