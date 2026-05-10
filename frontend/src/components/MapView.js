import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons not loading in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// A simple mock geocoder since we don't have a real API key for Mapbox/Google
const mockCoordinates = {
  'Tokyo': [35.6762, 139.6503],
  'Kyoto': [35.0116, 135.7681],
  'Osaka': [34.6937, 135.5023],
  'Paris': [48.8566, 2.3522],
  'London': [51.5074, -0.1278],
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Rome': [41.9028, 12.4964],
};

export default function MapView({ stops }) {
  // Map stops to coordinates, fallback to [0,0] if not found in our mock list
  const waypoints = stops.map(stop => ({
    ...stop,
    coords: mockCoordinates[stop.city] || [0, 0] // Default to equator if city unknown
  })).filter(stop => stop.coords[0] !== 0);

  const center = waypoints.length > 0 ? waypoints[0].coords : [20, 0];
  const polylineCoords = waypoints.map(w => w.coords);

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl h-[500px] overflow-hidden">
      <MapContainer center={center} zoom={3} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map((point, i) => (
          <Marker key={point._id} position={point.coords}>
            <Popup>
              <strong>Stop {i + 1}:</strong> {point.city}
            </Popup>
          </Marker>
        ))}
        {waypoints.length > 1 && (
          <Polyline positions={polylineCoords} color="#4f46e5" weight={4} dashArray="10, 10" />
        )}
      </MapContainer>
    </div>
  );
}
