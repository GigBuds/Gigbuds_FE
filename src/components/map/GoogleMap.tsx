"use client"
import {
    AdvancedMarker,
    APIProvider,
    Map,
    useAdvancedMarkerRef,
 } from "@vis.gl/react-google-maps";
 import { PlaceAutocomplete } from "./PlaceAutoComplete";
 import { useState, useEffect } from "react";
 import { MapHandler } from "./MapHandler";
import { GoogleMapResponse } from "@/types/folder/googleMapResponse";
 
   /**
   * GoogleMap component that integrates Google Maps with Place Autocomplete functionality.
   *
   * @param {string} API_KEY - The Google Maps API key.
   * @param {string} MAP_ID - The ID of the Google Map to be displayed.
   * @param {string} initialLocation - The initial location value to set on the map.
   * @param {boolean} hideAutocomplete - Flag to hide the autocomplete input.
   * @param {(location: GoogleMapResponse | null | undefined) => void} onChange - Callback function to handle location changes.
   */
 export default function GoogleMap({
      API_KEY, 
      MAP_ID,
      initialLocation,
      hideAutocomplete,
      onChange
   }: Readonly<{API_KEY: string, MAP_ID: string, initialLocation: string, hideAutocomplete:boolean, onChange: (location: GoogleMapResponse | null | undefined) => void }>) {
   const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
   const [markerRef, marker] = useAdvancedMarkerRef();

   // Handle initial location
   useEffect(() => {
      if (initialLocation && initialLocation.trim() !== '') {
         const timer = setTimeout(() => {
            if (window.google && window.google.maps) {
               const geocoder = new google.maps.Geocoder();
               
               geocoder.geocode({ 
                  address: initialLocation,
                  componentRestrictions: { country: 'VN' }
               }, (results, status) => {
                  if (status === 'OK' && results && results[0]) {
                     const place = results[0];
                     
                     const mockPlace: google.maps.places.Place = {
                        location: place.geometry.location,
                        viewport: place.geometry.viewport,
                        formattedAddress: place.formatted_address,
                        addressComponents: place.address_components?.map(component => ({
                           longText: component.long_name,
                           shortText: component.short_name,
                           types: component.types
                        }))
                     } as google.maps.places.Place;
                     
                     setSelectedPlace(mockPlace);
                     
                     onChange({
                        jobLocation: place.formatted_address,
                        provinceCode: place.address_components?.find(
                           (component) => component.types.includes("administrative_area_level_1")
                        )?.long_name,
                        districtCode: place.address_components?.find(
                           (component) => component.types.includes("administrative_area_level_2")
                        )?.long_name
                     });
                  } else {
                     console.warn('Geocoding failed:', status, 'for address:', initialLocation);
                     geocoder.geocode({ address: initialLocation }, (fallbackResults, fallbackStatus) => {
                        if (fallbackStatus === 'OK' && fallbackResults && fallbackResults[0]) {
                           const place = fallbackResults[0];
                           const mockPlace: google.maps.places.Place = {
                              location: place.geometry.location,
                              viewport: place.geometry.viewport,
                              formattedAddress: place.formatted_address,
                              addressComponents: place.address_components?.map(component => ({
                                 longText: component.long_name,
                                 shortText: component.short_name,
                                 types: component.types
                              }))
                           } as google.maps.places.Place;
                           
                           setSelectedPlace(mockPlace);
                           onChange({
                              jobLocation: place.formatted_address,
                              provinceCode: place.address_components?.find(
                                 (component) => component.types.includes("administrative_area_level_1")
                              )?.long_name,
                              districtCode: place.address_components?.find(
                                 (component) => component.types.includes("administrative_area_level_2")
                              )?.long_name
                           });
                        }
                     });
                  }
               });
            }
         }, 100);

         return () => clearTimeout(timer);
      }
   }, [initialLocation, onChange]);

   return (
      <APIProvider apiKey={API_KEY}>
         {hideAutocomplete ? null : (
         <div className="autocomplete-control">
            <PlaceAutocomplete 
               onPlaceSelect={(place) => {
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
               }} 
            />
         </div>
         )}
         <Map
            mapId={MAP_ID}
            style={{ width: "40vw", height: "40vh", margin: "auto" }}
            defaultCenter={{ lat: 10.8231, lng: 106.6297 }}
            defaultZoom={10}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
         >
            <AdvancedMarker ref={markerRef} position={null} />
         </Map>
         <MapHandler place={selectedPlace} marker={marker} />
      </APIProvider>
   );
 }