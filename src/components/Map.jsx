import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContexts";
import { useGeolocation } from "../hooks/useGeolocation.js";
import Button from "./Button";
import useURL from "../hooks/useURL";

const flagemojiToPNG = (flag) => {
  const countryCode = flag;
  return (
    <img
      src={`https://flagcdn.com/24x18/${String(countryCode).toLowerCase()}.png`}
      alt="flag"
    />
  );
};
function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const { isLoading, position, getPosition } = useGeolocation();
  const { lat, lng } = useURL();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );
  useEffect(
    function () {
      if (position.lat && position.lng)
        setMapPosition([position.lat, position.lng]);
    },
    [position]
  );
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        className={styles.map}
        zoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                {flagemojiToPNG(city.emoji || "")} <span>{city.cityName}</span>
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition}></ChangeCenter>
        <DetectClick></DetectClick>
        {!position.lat && !position.lng && (
          <Button type="position" onClick={getPosition}>
            {isLoading ? "Loading...." : "use your position"}
          </Button>
        )}
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  });
}

export default Map;
