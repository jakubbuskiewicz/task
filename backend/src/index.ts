import http from "http";
import url from "url";
import fetch from "node-fetch";
import { City } from "./types";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url || "", true);

  if (req.method === "GET" && parsedUrl.pathname === "/api/v1/cities") {
    // Handle query parameter "letter"
    const letter = (parsedUrl.query.letter as string)?.trim();

    // Validate the letter parameter
    if (!letter || letter.length !== 1) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: 'Query parameter "letter" must be a single character.' }));
      return;
    }

    const sampleCitiesUrl =
      "https://samples.openweathermap.org/data/2.5/box/city?bbox=12,32,15,37,10&appid=b6907d289e10d714a6e88b30761fae22";

    // Fetch sample cities data from the OpenWeatherMap API
    try {
      const response = await fetch(sampleCitiesUrl);

      // Check if the response is ok
      if (!response.ok) {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch sample cities data" }));
        return;
      }

      const data = await response.json();
      const citiesSample = Array.isArray(data.list) ? data.list : [];

      // Filter cities based on the letter parameter
      const filteredCities = citiesSample
        .filter((city: City) => city.name.toLowerCase().startsWith(letter.toLowerCase()))
        .map((city: City) => ({ name: city.name }));

      // Respond with the filtered cities
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ cities: filteredCities, count: filteredCities.length }));
    } catch (error) {
      // Handle fetch errors
      console.log("Error fetching sample cities data:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch sample cities data" }));
    }
    return;
  }

  // Not found
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
