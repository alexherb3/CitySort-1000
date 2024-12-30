import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import Chart from "chart.js/auto";

// The endpoint github code and some certain match code is from https://codesandbox.io/p/sandbox/search-data-top-1000-cities-vwyemv?file=%2Fsrc%2Fstyles.css%3A6%2C20

// Child Components from search.js and citylist.js, and using their controlled HTML elements
import SearchInput from "./search";
import CityList from "./citylist";

export default function App() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedBy, setSortedBy] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {
    console.log("searchTerm or sortedBy changed:", { searchTerm, sortedBy });
  }, [searchTerm, sortedBy]);

  // Fetch data from endpoint within useEffect hook
  useEffect(() => {
    const endpoint =
      "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // The code to help me create the bar chart is helped by CHATGPT and https://www.chartjs.org/docs/latest/getting-started/usage.html
  // Create or update chart based on search and sort
  useEffect(() => {
    if (cities.length === 0) return;

    const ctx = document.getElementById("populationChart");

    // Sort cities based on selected criteria by creating a copy of the cities array
    // Then filters by what's in the search box, and also by the sort criteria
    // (population, rank, name of the city, and name of the state)
    let sortedCities = [...cities];

    if (searchTerm) {
      sortedCities = sortedCities.filter(
        (city) =>
          city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortedBy === "population") {
      sortedCities.sort((a, b) => b.population - a.population);
    } else if (sortedBy === "rank") {
      sortedCities.sort((a, b) => a.rank - b.rank);
    } else if (sortedBy === "name_city") {
      sortedCities.sort((a, b) => a.city.localeCompare(b.city));
    } else if (sortedBy === "name_state") {
      sortedCities.sort((a, b) => a.state.localeCompare(b.state));
    }

    // I only choose to display 10 cities to reduce clutter and make the graph easier to read
    const top10Cities = sortedCities.slice(0, 10);

    const cityNames = top10Cities.map((city) => `${city.city}, ${city.state}`);
    const populations = top10Cities.map((city) => city.population);

    // Destroy previous chart to fix my error code that Canvas is already in use,
    // and charts must be destoryed before they can be reused.
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new bar chart with title population on y-axis
    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: cityNames,
        datasets: [
          {
            label: "Population",
            data: populations,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Population",
            },
          },
        },
      },
    });

    // Save chart instance to ref
    chartRef.current = newChart;

    // Clean up on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [cities, searchTerm, sortedBy]);

  // Data Entry Form
  return (
    <div className="App">
      <h1>CitySort 1000</h1>
      <div className="chart-container">
        <canvas id="populationChart"></canvas>
      </div>
      <SearchInput
        cities={cities}
        setSearchTerm={setSearchTerm}
        setSortedBy={setSortedBy}
      />
      <CityList
        cities={cities}
        searchTerm={searchTerm}
        sortedBy={sortedBy}
        key={`${searchTerm}-${sortedBy}`}
      />
    </div>
  );
}
