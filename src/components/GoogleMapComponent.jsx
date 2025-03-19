import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 57.929155,
  lng: 12.538081,
};

// Funktion för att beräkna avstånd mellan två punkter (Haversine-formeln)
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Jordens radie i km
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const GoogleMapComponent = ({ setTotalDistance, clearAll }) => {
  const [markers, setMarkers] = useState([]);
  const [distances, setDistances] = useState([]);

  // Lägg till en ny markör vid klick på kartan
  const handleMapClick = (event) => {
    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        id: Date.now(),
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    ]);
  };

  const handleMarkerDragEnd = (event, id) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    setMarkers((currentMarkers) =>
      currentMarkers.map((marker) =>
        marker.id === id ? { ...marker, lat: newLat, lng: newLng } : marker
      )
    );
  };

  useEffect(() => {
    if (markers.length < 2) {
      setDistances([]);
      setTotalDistance(0);
      return;
    }

    let total = 0;
    const newDistances = [];

    for (let i = 0; i < markers.length - 1; i++) {
      const d = haversineDistance(
        markers[i].lat,
        markers[i].lng,
        markers[i + 1].lat,
        markers[i + 1].lng
      );

      newDistances.push({
        id: `${markers[i].id}-${markers[i + 1].id}`,
        start: markers[i],
        end: markers[i + 1],
        distance: d.toFixed(2),
      });

      total += d;
    }

    setDistances(newDistances);
    setTotalDistance(total.toFixed(2));
  }, [markers]);

  useEffect(() => {
    if (clearAll) {
      setMarkers([]);
      setDistances([]);
      setTotalDistance(0);
    }
  }, [clearAll]);

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetch("https://aqps33wlqzkitdpkhd2666afni0faqdy.lambda-url.eu-north-1.on.aws/", {
        method: "GET",
        headers: {
            "x-access-key": "hjkhd3423jkasjhkd121jhjksadk4899sa", 
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Lambda response:", data);
        setApiKey(data.apiKey);
    })
    .catch(error => console.error("API key fetch error:", error));
}, []);


  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16} // Zoom satt till 16
        mapTypeId="satellite"
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            draggable={true}
            onDragEnd={(event) => handleMarkerDragEnd(event, marker.id)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(20, 20),
            }}
          />
        ))}

        {distances.length > 0 &&
          distances.map(({ id, start, end, distance }) => (
            <Polyline
              key={id}
              path={[start, end]}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
