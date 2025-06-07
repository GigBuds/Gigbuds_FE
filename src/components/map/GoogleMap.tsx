"use client"
import {
    AdvancedMarker,
    APIProvider,
    Map,
    useAdvancedMarkerRef,
 } from "@vis.gl/react-google-maps";
 import { PlaceAutocomplete } from "./PlaceAutoComplete";
 import { useState } from "react";
 import { MapHandler } from "./MapHandler";
import { GoogleMapResponse } from "@/types/folder/googleMapResponse";
 
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
      onChange
   }: Readonly<{API_KEY: string, MAP_ID: string, onChange: (location: GoogleMapResponse | null | undefined) => void }>) {
   const [selectedPlace, setSelectedPlace] =
      useState<google.maps.places.Place | null>(null);
   const [markerRef, marker] = useAdvancedMarkerRef();

   return (
      <APIProvider apiKey={API_KEY}>
         <div className="autocomplete-control">
         <PlaceAutocomplete onPlaceSelect={(place) => {
            setSelectedPlace(place);
            if (place) {
               onChange({
                  jobLocation: place.formattedAddress,
                  provinceCode: place.addressComponents?.find(
                     (component) => component.types.includes("administrative_area_level_1")
                  )?.longText,
                  districtCode: place.addressComponents?.find(
                     (component) => component.types.includes("administrative_area_level_2")
                  )?.longText
               });
            }
         }} />
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
 