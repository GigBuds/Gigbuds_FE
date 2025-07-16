"use client"
import {
    AdvancedMarker,
    APIProvider,
    Map,
    useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { PlaceAutocomplete } from "./PlaceAutoComplete";
import { useState, useEffect, useCallback, useRef } from "react";
import { MapHandler } from "./MapHandler";
import { GoogleMapResponse } from "@/types/googleMapResponse";

/**
 * GoogleMap component that integrates Google Maps with Place Autocomplete functionality.
 */
export default function GoogleMap({
    API_KEY, 
    MAP_ID,
    initialLocation,
    hideAutocomplete,
    onChange
}: Readonly<{
    API_KEY: string, 
    MAP_ID: string, 
    initialLocation: string, 
    hideAutocomplete: boolean, 
    onChange: (location: GoogleMapResponse | null | undefined) => void 
}>) {
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    
    // Refs to prevent loops and manage state
    const isGeocodingRef = useRef(false);
    const lastProcessedLocationRef = useRef<string>("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitializedRef = useRef(false);
    const userHasInteractedRef = useRef(false);

    /**
     * Stable onChange callback to prevent dependency issues
     */
    const stableOnChange = useCallback((response: GoogleMapResponse | null | undefined) => {
        onChange?.(response);
    }, [onChange]);

    /**
     * Extract location data from geocoder result
     */
    const extractLocationData = useCallback((place: google.maps.GeocoderResult): GoogleMapResponse => {
        return {
            jobLocation: place.formatted_address || '',
            provinceCode: place.address_components?.find(
                (component) => component.types.includes("administrative_area_level_1")
            )?.long_name,
            districtCode: place.address_components?.find(
                (component) => component.types.includes("administrative_area_level_2")
            )?.long_name
        };
    }, []);

    /**
     * Create mock place object for marker positioning
     */
    const createMockPlace = useCallback((geocoderResult: google.maps.GeocoderResult): google.maps.places.Place => {
        return {
            location: geocoderResult.geometry.location,
            viewport: geocoderResult.geometry.viewport,
            formattedAddress: geocoderResult.formatted_address,
            addressComponents: geocoderResult.address_components?.map(component => ({
                longText: component.long_name,
                shortText: component.short_name,
                types: component.types
            }))
        } as google.maps.places.Place;
    }, []);

    /**
     * Geocode address with proper error handling and no loops
     */
    const geocodeAddress = useCallback(async (address: string): Promise<void> => {
        // Prevent multiple simultaneous requests
        if (isGeocodingRef.current) {
            console.log('Geocoding already in progress, skipping...');
            return;
        }

        // Check if we already processed this location
        if (lastProcessedLocationRef.current === address) {
            console.log('Location already processed, skipping...');
            return;
        }

        if (!window.google?.maps) {
            console.warn('Google Maps API not available');
            return;
        }

        isGeocodingRef.current = true;
        lastProcessedLocationRef.current = address;

        try {
            const geocoder = new google.maps.Geocoder();
            
            // First attempt with country restriction
            const geocodeWithCountry = new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                geocoder.geocode({
                    address: address,
                    componentRestrictions: { country: 'VN' }
                }, (results, status) => {
                    if (status === 'OK' && results && results.length > 0) {
                        resolve(results);
                    } else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                });
            });

            let results: google.maps.GeocoderResult[];
            
            try {
                results = await geocodeWithCountry;
            } catch (error) {
                console.warn('Primary geocoding failed, trying fallback...', error);
                
                // Fallback without country restriction
                const geocodeWithoutCountry = new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                    geocoder.geocode({ address: address }, (results, status) => {
                        if (status === 'OK' && results && results.length > 0) {
                            resolve(results);
                        } else {
                            reject(new Error(`Fallback geocoding failed: ${status}`));
                        }
                    });
                });
                
                results = await geocodeWithoutCountry;
            }

            if (results && results.length > 0) {
                const place = results[0];
                const mockPlace = createMockPlace(place);
                const locationData = extractLocationData(place);

                // Update state
                setSelectedPlace(mockPlace);
                stableOnChange(locationData);
                
                console.log('Successfully geocoded:', address, '-> ', place.formatted_address);
            }

        } catch (error) {
            console.error('All geocoding attempts failed for:', address, error);
            // Don't call onChange with null to avoid clearing valid data
        } finally {
            isGeocodingRef.current = false;
        }
    }, [createMockPlace, extractLocationData, stableOnChange]);

    /**
     * Handle place selection from autocomplete
     */
    const handlePlaceSelect = useCallback((place: google.maps.places.Place | null) => {
        // Mark that user has interacted with the map
        userHasInteractedRef.current = true;
        
        if (!place) {
            setSelectedPlace(null);
            stableOnChange(null);
            return;
        }

        setSelectedPlace(place);
        
        const locationData: GoogleMapResponse = {
            jobLocation: place.formattedAddress || '',
            provinceCode: place.addressComponents?.find(
                (component) => component.types.includes("administrative_area_level_1")
            )?.longText,
            districtCode: place.addressComponents?.find(
                (component) => component.types.includes("administrative_area_level_2")
            )?.longText
        };
        
        stableOnChange(locationData);
        
        // Update the last processed location to prevent conflicts
        if (place.formattedAddress) {
            lastProcessedLocationRef.current = place.formattedAddress;
        }
        
        console.log('User selected place:', place.formattedAddress);
    }, [stableOnChange]);

    /**
     * Handle initial location ONLY on first mount - prevent overriding user selections
     */
    useEffect(() => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Only process initial location if:
        // 1. We have an initial location
        // 2. Component hasn't been initialized yet
        // 3. User hasn't interacted with the map
        if (!initialLocation?.trim() || 
            isInitializedRef.current || 
            userHasInteractedRef.current) {
            return;
        }

        console.log('Processing initial location (first time only):', initialLocation);

        // Debounce the geocoding request
        timeoutRef.current = setTimeout(() => {
            geocodeAddress(initialLocation.trim()).then(() => {
                isInitializedRef.current = true;
                console.log('Initial location processed, further changes will be ignored');
            });
        }, 200);

        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [initialLocation, geocodeAddress]);

    /**
     * Reset initialization when initialLocation changes significantly
     * (only if user hasn't interacted)
     */
    useEffect(() => {
        // Only reset if user hasn't interacted and location changes significantly
        if (!userHasInteractedRef.current && 
            initialLocation && 
            lastProcessedLocationRef.current && 
            initialLocation !== lastProcessedLocationRef.current) {
            
            console.log('Initial location changed, allowing re-initialization');
            isInitializedRef.current = false;
        }
    }, [initialLocation]);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            isGeocodingRef.current = false;
        };
    }, []);

    return (
        <APIProvider apiKey={API_KEY}>
            {!hideAutocomplete && (
                <div className="autocomplete-control">
                    <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                </div>
            )}
            <Map
                mapId={MAP_ID}
                style={{ width: "40vw", height: "40vh", margin: "auto" }}
                defaultCenter={{ lat: 10.8231, lng: 106.6297 }}
                defaultZoom={10}
                gestureHandling="greedy"
                disableDefaultUI={true}
            >
                <AdvancedMarker ref={markerRef} position={null} />
            </Map>
            <MapHandler place={selectedPlace} marker={marker} />
        </APIProvider>
    );
}