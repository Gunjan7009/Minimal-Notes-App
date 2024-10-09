import React, { useState } from "react";
import { useNotes } from "./NoteContext.jsx";
import "./styles.css";

export const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  const handleOverclick =(e)=> {
    if(e.target.classList.contains("modal-overlay")){
      onClose();
    }
  };
 

  return (
    <div className="modal-overlay" onClick={handleOverclick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export const GroupList = () => {
  const { groups, selectedGroup, setSelectedGroup } = useNotes();
  if (!groups) return null;
  const safeGroups = Array.isArray(groups) ? groups : [];
  return (
    <div className="group-list">
      {safeGroups.map((group) => (
        <div
          key={group.id}
          onClick={() => setSelectedGroup(group)}
          className={`group-item ${
            selectedGroup?.id === group.id ? "selected" : ""
          }`}
        >
          <div
            className="initial-circle"
            style={{
              backgroundColor: group.color,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {group.initials}
          </div>
          <div className="group-name">{group.name}</div>
        </div>
      ))}
    </div>
  
  );
};

export const CreateGroupDialog = ({ isOpen, onClose }) => {
  const { addGroup } = useNotes();
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#B38BFA");
  const colors = [
    "#B38BFA",
    "#FF79F2",
    "#43E6FC",
    "#F19576",
    "#0047FF",
    "#6691FF",
  ];

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    addGroup(newGroupName, selectedColor);
    setNewGroupName("");
    setSelectedColor("#D8A7F9");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title={`Create New Group`} onClose={onClose}>
      <div>
        <div className="first" style={{ display: "flex", gap: "20px" }}>
          <div className="groupheader">
            <h3>Group Name</h3>
          </div>
          <div className="groupname">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="input"
              onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
            />
          </div>
        </div>
        <div  style={{ display: "flex", gap: "30px" }}>
          <div className="Cname">
            <h3>Choose Color</h3>
          </div>
          <div className="color-picker">
            <div
              className="color-options"
              style={{ display: "flex", gap: "10px" }}
            >
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`color-circle ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="button-container">

          <button onClick={handleCreateGroup} className="button button-primary">
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
};
export const Sidebar = () => {
  const { selectedGroup } = useNotes();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <div className={`sidebar ${selectedGroup ? 'hidden' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Pocket Notes</h2>
        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="add-group-button"
        >
          +
        </button>
      </div>

     <GroupList />
      <CreateGroupDialog
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </div>
  );
};

