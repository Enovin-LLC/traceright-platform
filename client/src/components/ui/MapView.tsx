/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - "map-attached" → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - "standalone" → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - "data-only" → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
  }
}

// Note: For production, use your own Google Maps API key
// For demo purposes, this uses a placeholder
const API_KEY = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || "";

function loadMapScript(onLoad: () => void) {
  // If no API key, skip loading and just callback
  if (!API_KEY) {
    console.warn('Google Maps API key not configured. Using fallback map view.');
    onLoad();
    return;
  }

  // Check if already loaded
  if (window.google && window.google.maps) {
    onLoad();
    return;
  }

  // Check if script is already being loaded
  if (document.querySelector('script[src*="maps.googleapis.com"]')) {
    window.initGoogleMaps = onLoad;
    return;
  }

  // Create callback
  window.initGoogleMaps = onLoad;

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry&callback=initGoogleMaps`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    console.error('Failed to load Google Maps API');
    onLoad(); // Still call onLoad to show fallback
  };
  document.head.appendChild(script);
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  className = "",
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadMapScript(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapContainer.current || mapInstance.current) return;

    // If no Google Maps available, skip initialization and don't call onMapReady
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps not available - skipping map initialization');
      return;
    }

    try {
      mapInstance.current = new window.google!.maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: "DEMO_MAP_ID",
      });

      // Only call onMapReady if map was successfully created AND Google Maps is available
      if (onMapReady && mapInstance.current && window.google && window.google.maps) {
        onMapReady(mapInstance.current);
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
  }, [isLoaded, initialCenter, initialZoom, onMapReady]);

  // Show fallback if Google Maps is not available
  const showFallback = isLoaded && (!window.google || !window.google.maps);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-[500px] rounded-lg ${className}`}
      style={{ 
        background: showFallback ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined 
      }}
    >
      {!isLoaded && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      {showFallback && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl mb-2">Digital Twin Map View</h3>
            <p className="text-white/80 mb-4">Google Maps API key not configured</p>
            <p className="text-sm text-white/60 max-w-md">
              To enable live map tracking, add your Google Maps API key to your environment variables as VITE_GOOGLE_MAPS_API_KEY
            </p>
          </div>
        </div>
      )}
    </div>
  );
}