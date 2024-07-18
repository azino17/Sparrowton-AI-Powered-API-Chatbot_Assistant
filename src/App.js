import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('queryHistory')) || [];
    setHistory(storedHistory);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('queryHistory', JSON.stringify(history));
  }, [history]);

  const handleQuery = async () => {
    try {
      const result = await axios.post('http://localhost:5000/api/query', { query });
      const newResponse = result.data.response;
      setResponse(newResponse);

      // Add query and response to history
      const newEntry = { query, response: newResponse };
      setHistory([newEntry, ...history]);

    } catch (error) {
      console.error("There was an error with the query:", error);
      setResponse("Sorry, there was an error processing your request.");
    }
  };

  const handleGenerateCurl = async () => {
    try {
      const result = await axios.post('http://localhost:5000/api/generate-curl', { query });
      setResponse(result.data.curl_command);
    } catch (error) {
      console.error("There was an error generating cURL command:", error);
      setResponse("Sorry, there was an error processing your request.");
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('queryHistory');
    setHistory([]);
  };

  return (
    <div className="App">
      <header>
        <nav className="navbar">
          <div className="container">
            <h1 className="navbar-brand">API Documentation Assistant</h1>
          </div>
        </nav>
      </header>
      
      <main>
        <div className="container">
          <div className="query-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about the API..." required
            />
            <button className="btn-primary" onClick={handleQuery}>Ask</button>
            <button className="btn-secondary" onClick={handleGenerateCurl}>Generate cURL</button>
          </div>

          <div className="response-container">
            <h2>Response:</h2>
            <p>{response}</p>
          </div>

          <div className="history-container">
            <div className="history-header">
              <h2>Search History</h2>
              <button className="btn-clear-history" onClick={clearHistory}>Clear History</button>
            </div>
            <div className="history-list">
              <ul>
                {history.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.query}</strong>: {entry.response}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 API Documentation Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
