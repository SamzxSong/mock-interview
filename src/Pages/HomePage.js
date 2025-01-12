import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import PastInterviews from "../Components/PastInterviews";
import db from "../firebase";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const HomePage = () => {
  const [interviews, setInterviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [interviewName, setInterviewName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sessions"));
        const sessions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInterviews(sessions);
      } catch (error) {
        console.error("Error fetching sessions: ", error);
      }
    };

    fetchSessions();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInterviewName("");
  };

  const handleCreateInterview = async () => {
    if (!interviewName.trim()) {
      alert("Interview name cannot be empty!");
      return;
    }

    const sessionId = uuidv4(); // Generate unique session ID
    const newSession = {
      name: interviewName,
      date: new Date().toISOString(), // Store the current date
      duration: "0h 0m",
      questions: 0,
    };

    try {
      // Save the new session to Firestore
      await setDoc(doc(db, "sessions", sessionId), newSession);
      // Update the local state
      setInterviews((prev) => [...prev, { id: sessionId, ...newSession }]);
      handleClose(); // Close the dialog
      navigate(`/create-interview/${sessionId}`); // Redirect to the session
    } catch (error) {
      console.error("Error creating interview: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete session from Firestore
      await deleteDoc(doc(db, "sessions", id));
      // Update local state
      setInterviews((prev) => prev.filter((interview) => interview.id !== id));
    } catch (error) {
      console.error("Error deleting interview: ", error);
    }
  };

  const handleView = (id) => {
    navigate(`/create-interview/${id}`); // Navigate to the session page
  };

  return (
    <div className="home-container">
      <h1>Mock Interview</h1>
      <button className="create-button" onClick={handleOpen}>
        Create a New Interview
      </button>
      <div className="past-interviews-container">
        <h2>Past Interviews</h2>
        <PastInterviews
          interviews={interviews}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Interview</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Interview Name"
            type="text"
            fullWidth
            variant="standard"
            value={interviewName}
            onChange={(e) => setInterviewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateInterview} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
