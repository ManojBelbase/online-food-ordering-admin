import React, { useState } from "react";
import { Box, Button, Loader, Notification } from "@mantine/core";
import { IconTarget } from "@tabler/icons-react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Circle } from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const blueDotIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationSelectorMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: [number, number] | null;
}

const MapUpdater: React.FC<{ center: [number, number], zoom?: number }> = ({ center, zoom = 17 }) => {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 1 }); 
  return null;
};

const LocationSelectorMap: React.FC<LocationSelectorMapProps> = ({
  onLocationSelect,
  selectedLocation,
}) => {
  const defaultPosition: [number, number] = [27.7172, 85.3240]; // Default to Kathmandu
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
        setError(null); // Clear any previous errors
      },
    });
    return null;
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(latitude, longitude);
          setIsLoading(false);
        },
        (error) => {
          setIsLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("Location access denied. Please enable location services.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location unavailable. Please try again.");
              break;
            case error.TIMEOUT:
              setError("Location request timed out. Please try again.");
              break;
            default:
              setError("An error occurred while fetching your location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setIsLoading(false);
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <Box style={{ position: "relative", height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={selectedLocation || defaultPosition}
        zoom={15}
        minZoom={3} 
        maxZoom={19}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <ZoomControl position="topleft" /> */}
        <MapEvents />
        {selectedLocation && (
          <>
            <Marker position={selectedLocation} icon={blueDotIcon} />
            <Circle
              center={selectedLocation}
              radius={10} // Small circle for Google Maps-like blue dot
              pathOptions={{ color: "#3388ff", fillColor: "#3388ff", fillOpacity: 0.4 }}
            />
            <MapUpdater center={selectedLocation} />
          </>
        )}
      </MapContainer>

      <Button
        leftSection={<IconTarget size={18} />}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "white",
          color: "#3388ff",
          border: "1px solid #3388ff",
        }}
        onClick={handleGetCurrentLocation}
        disabled={isLoading}
      >
        {isLoading ? <Loader size="sm" /> : "Use Current Location"}
      </Button>

      {error && (
        <Notification
          color="red"
          title="Location Error"
          onClose={() => setError(null)}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        >
          {error}
        </Notification>
      )}
    </Box>
  );
};

export default LocationSelectorMap;