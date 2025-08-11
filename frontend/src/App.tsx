import React, { useState, useEffect } from "react";
import useFetchCityCount from "./hooks/useFetch";

const App = () => {
  const [letter, setLetter] = useState("");
  const { count, error, cities, loading, fetchCount } = useFetchCityCount();

  useEffect(() => {
    fetchCount(letter);
  }, [letter, fetchCount]);

  return (
    <div className="app">
      <h1>City Counter</h1>
      <p className="desc">Check the number of cities beginning with a specific letter</p>
      <div className="input-container">
        <label className="label" htmlFor="letter-input">
          Your letter (a-z):{" "}
        </label>
        <input
          id="letter-input"
          type="text"
          maxLength={1}
          value={letter}
          aria-label="Letter input"
          onChange={(e) => {
            setLetter(e.target.value.replace(/[^a-zA-Z]/g, ""));
          }}
          autoFocus
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="result">
          {count !== null && letter && !error && !loading && (
            <div className="card">
              <p className="count">
                Number of cities starting with &quot;{letter}&quot;: {count}
              </p>
              <p className="cities">
                {cities.length > 0 && (
                  <span> Cities: {cities.map(({ name }) => name).join(", ")}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
