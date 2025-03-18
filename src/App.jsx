import { useState } from "react";
import GoogleMapComponent from "./components/GoogleMapComponent";
import "./App.css";

function App() {
  const [totalDistance, setTotalDistance] = useState(0);
  const [tempo, setTempo] = useState(5); // min/km
  const [clearAll, setClearAll] = useState(false);

  // Beräkna tid i minuter baserat på tempo och distans
  const estimatedTime = (totalDistance * tempo).toFixed(0); // i minuter

  const handleReset = () => {
    window.location.reload();
    setClearAll(true);
    setTimeout(() => setClearAll(false), 100); // Återställ clearAll efter nollställning
  };

  return (
    <div className="mainCon">
      <div className="con">
        <h3>Google Maps Löpsträcka</h3>
        <p>Total sträcka: {totalDistance} km</p>
        <p>
          Beräknad löptid: {estimatedTime} min ({tempo} min/km)
        </p>

        <div className="tempo">
          <label>Justera tempo: {tempo} min/km</label>
          <input
            type="range"
            min="3"
            max="12"
            step="0.1"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
          />
        </div>
        <button onClick={handleReset}>Nollställ</button>
      </div>
      <GoogleMapComponent
        setTotalDistance={setTotalDistance}
        clearAll={clearAll}
      />
    </div>
  );
}

export default App;
