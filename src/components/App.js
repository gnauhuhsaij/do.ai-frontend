import React, { useState } from 'react';
import axios from 'axios';
import Workflow from './Workflow';
import '../styles/styles.css'; // Adjust the path to the styles folder

const App = () => {
  const [input, setInput] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async () => {
    if (!input.trim()) return; // Prevent empty input submission
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8000/process', {user_input: input});

      const parsedWorkflow = Object.entries(response.data).map(([subtaskName, details]) => ({
        name: subtaskName,
        description: details.description,
        steps: details.workflow.split('\n'), // Split the string into steps
      }));

      setWorkflow(parsedWorkflow); // Set workflow
    } catch (error) {
      console.error('Error generating workflow:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="app-container">
      <h1 className="website-title">Do.ai</h1>
      {!workflow ? (
        <>
          <div className="center-message">
            <h2>What do you want to do in this project?</h2>
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Tell us a task that you want to do in one sentence, and we will figure it out steps by steps!"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="spinner"></span> // Spinner element
              ) : (
                <i className="fas fa-paper-plane"></i> // Paper plane icon
              )}
            </button>
          </div>
        </>
      ) : (
        <Workflow workflow={workflow} />
      )}
    </div>
  );
};

export default App;
