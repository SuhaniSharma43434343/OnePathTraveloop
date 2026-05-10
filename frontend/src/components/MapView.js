import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icons broken by webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const mockCoordinates = {
  'Tokyo':       [35.6762,  139.6503],
  'Kyoto':       [35.0116,  135.7681],
  'Osaka':       [34.6937,  135.5023],
  'Paris':       [48.8566,    2.3522],
  'London':      [51.5074,   -0.1278],
  'New York':    [40.7128,  -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Rome':        [41.9028,   12.4964],
  'Bali':        [-8.3405,  115.0920],
  'Dubai':       [25.2048,   55.2708],
  'Manali':      [32.2396,   77.1887],
  'Goa':         [15.2993,   74.1240],
  'Ladakh':      [34.1526,   77.5771],
  'Rajasthan':   [27.0238,   74.2179],
  'Maldives':    [ 3.2028,   73.2207],
  'Santorini':   [36.3932,   25.4615],
};

export default function MapView({ stops }) {
  const waypoints = stops
    .map(stop => ({ ...stop, coords: mockCoordinates[stop.city] }))
    .filter(stop => stop.coords);

  const center = waypoints.length > 0 ? waypoints[0].coords : [20, 0];
  const polylineCoords = waypoints.map(w => w.coords);

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl h-[500px] overflow-hidden">
      <MapContainer center={center} zoom={waypoints.length > 0 ? 4 : 2} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map((point, i) => (
          <Marker key={point._id} position={point.coords}>
            <Popup><strong>Stop {i + 1}:</strong> {point.city}</Popup>
          </Marker>
        ))}
        {waypoints.length > 1 && (
          <Polyline positions={polylineCoords} color="#4f46e5" weight={4} dashArray="10, 10" />
        )}
      </MapContainer>
    </div>
  );
}
