import React, { useState, useEffect } from "react";
import "../styles/ModalContainer.css"; // Adjust the path to the styles folder
import axios from "axios";

const ModalContainer = ({ isLoading, step, evidence, classification }) => {
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "agent",
      text: "Initializing chat... Please wait.",
    },
  ]); // Store chat messages with a placeholder
  const [userInput, setUserInput] = useState("");
  const [appId, setAppId] = useState(null); // Store app_id for the session

  const sendMessage = async () => {
    try {
      let response;

      if (!appId) {
        // First request to initialize the chat
        response = await axios.post("http://127.0.0.1:8000/api/chat", {
          nested_tasks: step.name,
        });

        if (response.status === 200) {
          const { app_id, responses } = response.data;
          setAppId(app_id); // Save the app_id for future requests
          const initialResponse = {
            sender: "agent",
            text: responses, // Adjust based on actual response format
          };
          // Replace the placeholder message with the actual response
          setChatHistory([initialResponse]);
        } else {
          console.error("Failed to initialize chat:", response.data.error);
          setChatHistory((prev) => [
            ...prev,
            { sender: "agent", text: "Failed to initialize chat." },
          ]);
        }
      }
    } catch (error) {
      console.error("Error in chat initialization:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "agent", text: "Error occurred during initialization." },
      ]);
    }
  };

  useEffect(() => {
    sendMessage(); // Call sendMessage immediately after component mounts
  }, []); // Empty dependency array ensures it runs only once

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat history
    const userMessage = { sender: "user", text: userInput };
    setChatHistory((prev) => [...prev, userMessage]);

    // Clear the input box
    setUserInput("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat2", {
        app_id: appId,
        user_response: userInput,
      });

      if (response.status === 200) {
        const { responses } = response.data;
        const agentMessage = {
          sender: "agent",
          text: responses, // Adjust based on actual response format
        };
        setChatHistory((prev) => [...prev, agentMessage]);
      } else {
        console.error("Failed to send message:", response.data.error);
      }
    } catch (error) {
      console.error("Error in chat communication:", error);
    }
  };

  if (classification === "Gather information from user") {
    return (
      <div className="modal-container user">
        <div className="chat-container">
          <div className="chat-history">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender === "user" ? "user-message" : "agent-message"
                }`}
              >
                {message.sender === "agent" && (
                  <div className="icon-circle agent-icon">A</div>
                )}
                <div className="message-text">{message.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleUserInput}></button>
          </div>
        </div>
      </div>
    );
  }

  if (classification !== "Gather information from external sources") {
    return (
      <div className="modal-container">
        <div className="placeholder-content">
          <h2>Coming Soon</h2>
          <p>Details for classification: {classification}</p>
        </div>
      </div>
    );
  }
  if (classification !== "Gather information from external sources") {
    // Placeholder block for other classifications
    return (
      <div className="modal-container">
        <div className="placeholder-content">
          <h2>Coming Soon</h2>
          <p>Details for classification: {classification}</p>
        </div>
      </div>
    );
  }

  // Content for "Gather information from external sources"
  return (
    <div className="modal-container">
      {isLoading ? (
        <div>
          <div className="search-header">
            <h2>Loading...</h2>
            <h4>Please wait while we fetch search results for {step.name}.</h4>
          </div>
        </div>
      ) : (
        <div>
          <div className="search-header">
            <h2>Search Results: {step.name}</h2>
            <h4>Searched 10 results based on Google search</h4>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {evidence?.length
              ? evidence.slice(0, 20).map((item, index) => (
                  <div key={index} className="evidence-container">
                    <div className="evidence-link">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {new URL(item.link).hostname}
                      </a>
                    </div>
                    <div className="evidence-title">{item.title}</div>
                    <div className="evidence-snippet">{item.snippet}</div>
                  </div>
                ))
              : "Click the role circle to fetch evidence."}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalContainer;
