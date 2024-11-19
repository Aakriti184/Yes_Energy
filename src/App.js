import React, { useState, useEffect } from 'react';
import './App.css';
import Spreadsheet from './Spreadsheet';
import Graph from './Graph';
import DualDisplay from './DualDisplay';
import Statistics from './Statistics';
import axios from 'axios';  // Import Axios

export default function App() {
  const [page, setPage] = useState(1); // State to track the current page (1: Welcome, 2: Dashboard)
  const [activeTab, setActiveTab] = useState(1); // State to track active tab for Page 2 (Dashboard)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [message, setMessage] = useState('');  // State for API message

  useEffect(() => {
    if (activeTab === 2) {
      // Make API call when Graph tab is active
      axios.get('http://127.0.0.1:8000/api/hello/')
        .then(response => {
          // Set the response message in the state
          setMessage(response.data.message);
        })
        .catch(error => {
          console.error('Error fetching data from the API:', error);
        });
    }
  }, [activeTab]); // The API call will run whenever activeTab changes to 2 (Graph)

  // Participant list (can be replaced with dynamic data)
  const participants = ['Akriti', 'Dev', 'Nandita', 'Prachal', 'Yamuna'];

  // Function to render the dashboard (Page 2)
  const renderDashboard = () => {
    const renderTabContent = () => {
      switch (activeTab) {
        case 1:
          return <Spreadsheet />;
        case 2:
          return (
            <div>
              <Graph />
              <p>Message from Django: {message}</p> {/* Display API message */}
            </div>
          );
        case 3:
          return <DualDisplay />;
        case 4:
          return <Statistics />;
        default:
          return <Spreadsheet />;
      }
    };

    return (
      <div className="App">
        <div className="sidenav">
          <h2>Sidenav</h2>
          <div>
            <label>
              Model:
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Select a model</option>
                <option value="Forecast">Forecast</option>
                <option value="Forecast A">Forecast A</option>
              </select>
            </label>
            <button onClick={() => setActiveTab(activeTab)}>Refresh</button>
            <div>
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button className={activeTab === 1 ? 'active' : ''} onClick={() => setActiveTab(1)}>
            Spreadsheet
          </button>
          <button className={activeTab === 2 ? 'active' : ''} onClick={() => setActiveTab(2)}>
            Graph
          </button>
          <button className={activeTab === 3 ? 'active' : ''} onClick={() => setActiveTab(3)}>
            Dual Display
          </button>
          <button className={activeTab === 4 ? 'active' : ''} onClick={() => setActiveTab(4)}>
            Statistics
          </button>
        </div>

        <div className="content">
          {renderTabContent()}
        </div>
      </div>
    );
  };

  // Function to render the welcome page (Page 1)
  const renderWelcomePage = () => {
    return (
      <div className="welcome-page">
        <h1>Welcome to Our Dashboard</h1>
        <button onClick={() => setPage(2)}>Go to Dashboard</button>
        <div className="participants-button-container">
          <button className="participants-button">
            Hover to see Participants
            <div className="participants-list">
              {participants.map((participant, index) => (
                <span key={index} className="participant">
                  {participant}
                </span>
              ))}
            </div>
          </button>
        </div>
      </div>
    );
  };

  return <div>{page === 1 ? renderWelcomePage() : renderDashboard()}</div>;
}
