import React from "react";

// Handles for change in input when searching and sorting utilizing our input field and
// dropdown (select); this will cause our list of cities to update and change.
export default function SearchInput({ setSearchTerm, setSortedBy }) {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortedBy(event.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search"
        placeholder="Enter city or state"
        onChange={handleInputChange}
      />
      <select className="select" onChange={handleSortChange}>
        <option value="">Sort By</option>
        <option value="name_city">Name (City)</option>
        <option value="name_state">Name (State)</option>
        <option value="population">Population</option>
        <option value="rank">Rank</option>
      </select>
    </div>
  );
}
