import React from 'react';

function SidenavComponent() {
  return (
    <div className="sidenav">
      <h3>Sidenav</h3>
      <label htmlFor="view-select">Select View:</label>
      <select id="view-select">
        <option value="view1">View 1</option>
        <option value="view2">View 2</option>
        <option value="view3">View 3</option>
      </select>
    </div>
  );
}

export default SidenavComponent;
