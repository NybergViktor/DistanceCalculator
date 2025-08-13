import { useState, useEffect, useContext } from "react";
import { LocationContext } from "./LocationContext";
import "./Weathercss.css"

const WeatherComponent = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { latitude, longitude } = useContext(LocationContext);

  const API_KEY = "c1c2a9e7baffbc21c586db21e1989f4b"; // aws secret (cors)
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

  if (latitude != "" && longitude != "" && !weather) {
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Misslyckades med att hämta väderdata");
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }

  if (loading) return <p></p>;
  if (error) return <p>Kan inte ladda väder.</p>;

  return (
    <div className="weatherCon">
      <p>{weather.main.temp}°C</p>
      <p>{weather.weather[0].description}</p>
    </div>
  );
};

export default WeatherComponent;
