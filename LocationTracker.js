import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LocationTracker() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(newLocation);
        updateLocation(newLocation);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
  const updateLocation = async (locationData) => {
    try {
      await axios.post('http://localhost:3000/location/', locationData);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Location Tracker</h2>
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default LocationTracker;