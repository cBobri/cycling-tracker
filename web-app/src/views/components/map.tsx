import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

// Import marker images
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Create a custom icon
const customMarkerIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIconRetinaPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const Map = ({ coordinates, markers, center }: any) => {
    return (
        <MapContainer
            center={[center.latitude, center.longitude]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={coordinates} />
            {markers.map((marker: any, index: number) => (
                <Marker
                    key={index}
                    position={[marker.lat, marker.lng]}
                    icon={customMarkerIcon}
                >
                    <Popup>{index === 0 ? "Start" : "End"}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
