import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import CreateInterviewPage from "./Pages/CreateInterviewPage";
import RedirectToNewSession from "./Components/RedirectToNewSession";
import "./App.css";

function App() {
  return (
    <Router basename="/mock-interview">
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route
          path="/create-interview/:sessionId"
          element={<CreateInterviewPage />}
        />
        <Route path="/create-interview" element={<RedirectToNewSession />} />
      </Routes>
    </Router>
  );
}

export default App;
