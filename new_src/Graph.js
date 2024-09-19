import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function Graph() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/load-forecast')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  // Automatically parses JSON
      })
      .then(data => {
        console.log("Graph data received:", data);  // Check the received data
        setGraphData(data);  // Directly set the parsed JSON data
      })
      .catch(error => console.error('Error fetching graph data:', error));
  }, []);
  

  return (
    <div>
      {graphData ? (
        <Plot
          data={graphData.data}
          layout={graphData.layout}
        />
      ) : (
        <div>Loading graph...</div>
      )}
    </div>
  );
}

export default Graph;
