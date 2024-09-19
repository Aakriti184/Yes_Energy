import React, { useState } from 'react';

function TabsComponent() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Spreadsheet', 'Graph', 'Dual Display', 'Statistics', 'Jst Period Beginning']; 

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {activeTab === 0 && <div>Content for Spreadsheet</div>}
        {activeTab === 1 && <div>Content for Graph</div>}
        {activeTab === 2 && <div>Content for Dual Display</div>}
        {activeTab === 3 && <div>Content for Statistics</div>}
      </div>
    </div>
  );
}

export default TabsComponent;
