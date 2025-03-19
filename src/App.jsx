import { useState } from "react";
import GoogleMapComponent from "./components/GoogleMapComponent";
import "./App.css";
import WeatherComponent from "./components/WeatherComponent";
import { LocationProvider } from "./components/LocationContext";

function App() {
  const [totalDistance, setTotalDistance] = useState(0);
  const [activity, setActivity] = useState("run"); // Standard: Löpning
  const [tempo, setTempo] = useState(5); // Standardtempo för löpning
  const [clearAll, setClearAll] = useState(false);

  // Funktion för att hantera aktivitetsbyte
  const handleActivityChange = (e) => {
    const selectedActivity = e.target.value;
    setActivity(selectedActivity);

    // Sätt standardvärden för tempo beroende på aktivitet
    if (selectedActivity === "run") {
      setTempo(5); // Löpning: 5 min/km
    } else if (selectedActivity === "walk") {
      setTempo(10); // Gång: 10 min/km
    } else if (selectedActivity === "bike") {
      setTempo(30); // Cykel: 30 km/h
    }
  };

  // Anpassa min/max för tempo beroende på aktivitet
  const getTempoRange = () => {
    if (activity === "run") return { min: 3, max: 10, unit: "min/km" };
    if (activity === "walk") return { min: 5, max: 15, unit: "min/km" };
    if (activity === "bike") return { min: 20, max: 50, unit: "km/h" };
  };

  const { min, max, unit } = getTempoRange();

  // Beräkna tid beroende på aktivitet
  const estimatedTime = activity === "bike"
    ? ((totalDistance / tempo) * 60).toFixed(0) // Omvandlar km/h till minuter
    : (totalDistance * tempo).toFixed(0); // För löpning/gång: tempo i min/km

  const handleReset = () => {
    window.location.reload();
    setClearAll(true);
    setTimeout(() => setClearAll(false), 100);
  };

  return (
    <LocationProvider>
      <div className="mainCon">
        <div className="con">
          <h3>Google Maps Löpsträcka</h3>

          <label>Välj aktivitet: </label>
          <select value={activity} onChange={handleActivityChange}>
            <option value="run">Löpning</option>
            <option value="walk">Gång</option>
            <option value="bike">Cykling</option>
          </select>

          <p>Total sträcka: {totalDistance} km</p>
          <p>
            Beräknad {activity === "run" ? "löptid" : activity === "walk" ? "gångtid" : "cyklad tid"}: {estimatedTime} min ({tempo} {unit})
          </p>

          <div className="tempo">
            <label>Justera tempo: {tempo} {unit}</label>
            <input
              type="range"
              min={min}
              max={max}
              step="0.1"
              value={tempo}
              onChange={(e) => setTempo(parseFloat(e.target.value))}
            />
          </div>

          <WeatherComponent />

          <button onClick={handleReset}>Nollställ</button>
        </div>

        <GoogleMapComponent setTotalDistance={setTotalDistance} clearAll={clearAll} />
      </div>
    </LocationProvider>
  );
}

export default App;
