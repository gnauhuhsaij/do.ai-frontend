import React, { useState } from 'react';

const Workflow = ({ workflow }) => {
  // State to track which subtasks are expanded (open)
  const [expandedSubtasks, setExpandedSubtasks] = useState({});

  // Toggle the expanded state of a subtask
  const toggleSubtask = (index) => {
    setExpandedSubtasks((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific subtask's state
    }));
  };

  const [selectedStep, setSelectedStep] = useState(null);

  return (
    <div className="workflow-container">
      {workflow.map((subtask, index) => (
        <div key={index} className="subtask">
          {/* Subtask Title (clickable to toggle) */}
          <h2 onClick={() => toggleSubtask(index)} className="subtask-title">
            {subtask.name}
          </h2>
          <p className="subtask-description">{subtask.description}</p>

          {/* Conditionally render steps if the subtask is expanded */}
          {expandedSubtasks[index] && (
            <div className="steps">
              {subtask.steps.map((step, i) => (
                <div
                  key={i}
                  className="step"
                  onClick={() => setSelectedStep(step)}
                >
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Side window for selected step */}
      {selectedStep && (
        <div className="side-window">
          <h3>Step Details</h3>
          <p>{selectedStep}</p>
          <button onClick={() => setSelectedStep(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Workflow;
