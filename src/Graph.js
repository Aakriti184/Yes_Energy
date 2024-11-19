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
          return response.json();
       })
       .then(data => {
        console.log("Graph data received:", data);
        setGraphData(data);  // Directly set the data, as it's already parsed
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
