"use client"
import {
    AdvancedMarker,
    APIProvider,
    Map,
    useAdvancedMarkerRef,
 } from "@vis.gl/react-google-maps";
 import { PlaceAutocomplete } from "./PlaceAutoComplete";
 import { useEffect, useState } from "react";
 import { MapHandler } from "./MapHandler";
 

 
 export default function GoogleMap({
      API_KEY, 
      MAP_ID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value,
      onChange
   }: Readonly<{API_KEY: string, MAP_ID: string, value: string | null | undefined, onChange: (location: string | null | undefined) => void }>) {
   const [selectedPlace, setSelectedPlace] =
      useState<google.maps.places.Place | null>(null);
   const [markerRef, marker] = useAdvancedMarkerRef();

   useEffect(() => {
      if (selectedPlace) {
         onChange(selectedPlace.formattedAddress);
      }
   }, [selectedPlace, onChange]);

   return (
      <APIProvider apiKey={API_KEY}>
         <div className="autocomplete-control">
         <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
         </div>
         <Map
         mapId={MAP_ID}
         style={{ width: "40vw", height: "40vh", margin: "auto" }}
         defaultCenter={{ lat: 0, lng: 0 }}
         defaultZoom={3}
         gestureHandling={"greedy"}
         disableDefaultUI={true}
         >
            <AdvancedMarker ref={markerRef} position={null} />
         </Map>
         <MapHandler place={selectedPlace} marker={marker} />
      </APIProvider>
   );
 }
 