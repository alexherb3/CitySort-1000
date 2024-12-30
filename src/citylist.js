import React from "react";

// Find matching cities based on what we search
// And we are able to sort and filter based on what we searched
export default function CityList({ cities, searchTerm, sortedBy }) {
  const findMatches = (wordToMatch) => {
    const regex = new RegExp(wordToMatch, "gi");
    return cities.filter(
      (place) => place.city.match(regex) || place.state.match(regex)
    );
  };

  const sortedArray = findMatches(searchTerm).sort((a, b) => {
    if (sortedBy === "population") {
      return b.population - a.population;
    } else if (sortedBy === "rank") {
      return a.rank - b.rank;
    } else if (sortedBy === "name_city") {
      // Sort by city name
      return a.city.localeCompare(b.city);
    } else if (sortedBy === "name_state") {
      // Sort by state name
      return a.state.localeCompare(b.state);
    } else {
      return 0;
    }
  });

  return (
    <ul className="suggestions" id="suggestions">
      {sortedArray.map((place) => (
        <li key={place.rank}>
          <span className="name">
            {place.city}, {place.state}
          </span>
          <span className="population">
            Population: {numberWithCommas(place.population)}
          </span>
          <span className="rank">Rank: {place.rank}</span>
        </li>
      ))}
    </ul>
  );
}

// Credit: https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
// This is just a helper function that adds a comma to the population number for better readability
function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
