"use client";
import { useState, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface PlaceAutocompleteProps {
   onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

interface PlacePredictionSelectEvent extends Event {
   placePrediction: google.maps.places.PlacePrediction;
}

export const PlaceAutocomplete = ({
   onPlaceSelect,
}: PlaceAutocompleteProps) => {
   const [placeAutocomplete, setPlaceAutocomplete] =
      useState<google.maps.places.PlaceAutocompleteElement | null>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const places = useMapsLibrary("places");

   useEffect(() => {
      if (!places) return;

      const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement(
         {}
      );
      placeAutocomplete.name = "place-autocomplete-input";
      placeAutocomplete.style.border = "5px solid #f54747";
      placeAutocomplete.style.borderRadius = "10px";
      placeAutocomplete.style.width = "50%";
      placeAutocomplete.style.margin = "auto";
      setPlaceAutocomplete(placeAutocomplete);
   }, [places]);

   useEffect(() => {
      if (!placeAutocomplete || !containerRef.current) return;
      const container = containerRef.current;
      container.appendChild(placeAutocomplete);
      return () => {
         if (container && placeAutocomplete.parentNode === container) {
            container.removeChild(placeAutocomplete);
         }
      };
   }, [placeAutocomplete]);

   useEffect(() => {
      if (!placeAutocomplete) return;

      placeAutocomplete.addEventListener("gmp-select", async (event: Event) => {
         const typedEvent = event as PlacePredictionSelectEvent;
         const place: google.maps.places.Place = typedEvent.placePrediction.toPlace();
         await place.fetchFields({
            fields: [
               "viewport",
               "location",
               "displayName",
               "formattedAddress",
               "addressComponents",
            ],
         });
         onPlaceSelect(place);
      });
   }, [onPlaceSelect, placeAutocomplete]);

   return <div className="autocomplete-container" ref={containerRef} />;
};
