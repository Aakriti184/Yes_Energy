import React, { useState } from 'react';
import './App.css';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ['Dashboard', 'Analytics', 'Reports', 'Settings', 'Profile'];

  return (
    <div className="sidebar">
      <h2>My Dashboard</h2>
      <ul>
        {tabs.map((tab) => (
          <li 
            key={tab} 
            className={activeTab === tab ? 'active' : ''} 
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabContent({ activeTab }) {
  return (
    <div className="tab-content">
      <p>This is the content for the {activeTab} tab.</p>
    </div>
  );
}

function Dashboard({ activeTab }) {
  return (
    <div className="dashboard">
      <h1>{activeTab}</h1>
      <TabContent activeTab={activeTab} />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Dashboard activeTab={activeTab} />
    </div>
  );
}

export default App;
