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
import { googleMapResponse } from "@/types/folder/GoogleMapResponse";
 
 

   /**
   * GoogleMap component that integrates Google Maps with Place Autocomplete functionality.
   *
   * @param {string} API_KEY - The Google Maps API key.
   * @param {string} MAP_ID - The ID of the Google Map to be displayed.
   * @param {string | null | undefined} value - The current selected location value.
   * @param {(location: googleMapResponse | null | undefined) => void} onChange - Callback function to handle location changes.
   */
 export default function GoogleMap({
      API_KEY, 
      MAP_ID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value,
      onChange
   }: Readonly<{API_KEY: string, MAP_ID: string, value: string | null | undefined, onChange: (location: googleMapResponse | null | undefined) => void }>) {
   const [selectedPlace, setSelectedPlace] =
      useState<google.maps.places.Place | null>(null);
   const [markerRef, marker] = useAdvancedMarkerRef();

   useEffect(() => {
      if (selectedPlace) {
         onChange(
            {
               location: selectedPlace.formattedAddress, 
               provinceCode: selectedPlace.addressComponents?.find(
                  (component) => component.types.includes("administrative_area_level_1")
               )?.longText, 
               districtCode: selectedPlace.addressComponents?.find(
                  (component) => component.types.includes("administrative_area_level_2")
               )?.longText
            }
         );
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
 