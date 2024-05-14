import { useEffect, useState } from "react";
import * as Location from "expo-location";

const useLocation = (shouldFetch = true) => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        console.error("Location permission not granted");
        return;
      }

      const lastKnownLocation = await Location.getLastKnownPositionAsync();

      if (lastKnownLocation && lastKnownLocation.coords) {
        const { latitude, longitude } = lastKnownLocation.coords;
        if (latitude && longitude) {
          setLocation({ latitude, longitude });
        } else {
          console.error("Location data not available");
        }
      } else {
        console.error("Last known location not available");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      getLocation();
    }
  }, [shouldFetch]);

  return location ? { latitude: location.latitude, longitude: location.longitude } : null;
};

export default useLocation;
