import React, { useState, useRef, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import db from "../firebase"; // Adjust the path based on your setup
import { useParams, useNavigate } from "react-router-dom";
import "./CreateInterviewPage.css";

const CreateInterviewPage = () => {
  const { sessionId } = useParams();
  const [leftWidth, setLeftWidth] = useState(40);
  const [output, setOutput] = useState("");
  const resizerRef = useRef(null);
  const [code, setCode] = useState("");
  const codeRef = useRef(null);
  const [pyodide, setPyodide] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideInstance = await window.loadPyodide();
      console.log("Pyodide loaded successfully");
      setPyodide(pyodideInstance);
    };
    loadPyodide();
  }, []);

  useEffect(() => {
    const docRef = doc(db, "sessions", sessionId);

    const fetchSession = async () => {
      const sessionSnap = await getDoc(docRef);
      if (sessionSnap.exists()) {
        setCode(sessionSnap.data().code || "");
      } else {
        console.log("the session does not exist");
        await setDoc(docRef, { code: "" });
      }
    };

    fetchSession();

    // Listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setCode(snapshot.data().code);
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    const docRef = doc(db, "sessions", sessionId);
    updateDoc(docRef, { code: newCode });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const containerWidth = resizerRef.current.parentElement.offsetWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;
    if (newLeftWidth > 10 && newLeftWidth < 90) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const executeCode = async () => {
    const code = codeRef.current.value;
    if (!pyodide) {
      setOutput("Pyodide is still loading. Please wait...");
      return;
    }
    try {
      const code_real =
        "import sys\n" +
        "from io import StringIO\n" +
        "sys.stdout = StringIO()\n" +
        code;
      const result = await pyodide.runPythonAsync(code_real);
      let temp_res = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      setOutput(temp_res || "Code executed successfully with no output.");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-interview-container">
      <div className="header-container">
        <button className="go-back-button" onClick={() => navigate("/")}>
          Go Back to Home
        </button>
        <h1 className="create-interview-title">Interview</h1>
      </div>
      <div className="textarea-wrapper">
        <textarea
          className="textarea-left"
          style={{ width: `${leftWidth}%` }}
          placeholder="Paste a Question here!"
        ></textarea>
        <div
          className="resizer"
          ref={resizerRef}
          onMouseDown={handleMouseDown}
        ></div>
        <textarea
          ref={codeRef}
          value={code}
          onChange={handleCodeChange}
          className="textarea-right"
          style={{ width: `${100 - leftWidth}%` }}
          placeholder="Write your code here ..."
        ></textarea>
      </div>
      <button className="run-button" onClick={executeCode}>
        Run Code
      </button>
      <div className="output-container">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CreateInterviewPage;
