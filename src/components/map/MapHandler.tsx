"use client";
import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
interface MapHandlerProps {
   place: google.maps.places.Place | null;
   marker: google.maps.marker.AdvancedMarkerElement | null;
}

export const MapHandler = ({ place, marker }: MapHandlerProps) => {
   const map = useMap();

   useEffect(() => {
      if (!map || !place || !marker) return;

      if (place.viewport) {
         map.fitBounds(place.viewport);
      }
      marker.position = place.location;
   }, [map, place, marker]);

   return null;
};
