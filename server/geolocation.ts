import axios from "axios";

interface GeolocationResult {
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Get user location from IP address using ipapi.co (free tier: 1000 requests/day)
 * Falls back to ip-api.com if ipapi fails
 */
export async function getLocationFromIP(ip: string): Promise<GeolocationResult> {
  // Skip geolocation for localhost/private IPs
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return {
      city: "Wildwood", // Default for development
      state: "NJ",
      country: "US",
      latitude: 38.9918,
      longitude: -74.8149,
    };
  }

  try {
    // Try ipapi.co first (more reliable)
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000,
    });

    return {
      city: response.data.city || null,
      state: response.data.region_code || null,
      country: response.data.country_code || null,
      latitude: response.data.latitude || null,
      longitude: response.data.longitude || null,
    };
  } catch (error) {
    console.warn("[Geolocation] ipapi.co failed, trying ip-api.com:", error);

    try {
      // Fallback to ip-api.com (free, no key required)
      const response = await axios.get(`http://ip-api.com/json/${ip}`, {
        timeout: 5000,
      });

      if (response.data.status === "success") {
        return {
          city: response.data.city || null,
          state: response.data.region || null,
          country: response.data.countryCode || null,
          latitude: response.data.lat || null,
          longitude: response.data.lon || null,
        };
      }
    } catch (fallbackError) {
      console.error("[Geolocation] Both IP APIs failed:", fallbackError);
    }
  }

  // Return null location if all attempts fail
  return {
    city: null,
    state: null,
    country: null,
    latitude: null,
    longitude: null,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the closest Chamber to a given location
 * Uses city/state coordinates and calculates distance
 */
export function findClosestChamber(
  userLat: number,
  userLon: number,
  chambers: Array<{
    id: number;
    name: string;
    nameEs: string | null;
    city: string | null;
    state: string | null;
    description: string | null;
    descriptionEs: string | null;
    website: string | null;
    signupUrl: string | null;
    logoUrl: string | null;
    primaryColor: string | null;
    linkedinUrl: string | null;
    facebookUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    tiktokUrl: string | null;
    latitude?: number;
    longitude?: number;
  }>
): (typeof chambers[0] & { distance: number }) | null {
  if (chambers.length === 0) return null;

  // City coordinates for major NJ cities and US cities
  const cityCoordinates: Record<string, { lat: number; lon: number }> = {
    // NJ Cities
    "Atlantic City,NJ": { lat: 39.3643, lon: -74.4229 },
    "Hackensack,NJ": { lat: 40.8859, lon: -74.0435 },
    "Mount Holly,NJ": { lat: 39.9929, lon: -74.7879 },
    "Camden,NJ": { lat: 39.9259, lon: -75.1196 },
    "Cape May Court House,NJ": { lat: 39.0829, lon: -74.8238 },
    "Vineland,NJ": { lat: 39.4862, lon: -75.0257 },
    "Newark,NJ": { lat: 40.7357, lon: -74.1724 },
    "Woodbury,NJ": { lat: 39.8387, lon: -75.1527 },
    "Jersey City,NJ": { lat: 40.7178, lon: -74.0431 },
    "Flemington,NJ": { lat: 40.5123, lon: -74.8593 },
    "Trenton,NJ": { lat: 40.2171, lon: -74.7429 },
    "New Brunswick,NJ": { lat: 40.4862, lon: -74.4518 },
    "Freehold,NJ": { lat: 40.2601, lon: -74.2738 },
    "Morristown,NJ": { lat: 40.7968, lon: -74.4815 },
    "Toms River,NJ": { lat: 39.9537, lon: -74.1979 },
    "Paterson,NJ": { lat: 40.9168, lon: -74.1718 },
    "Salem,NJ": { lat: 39.5718, lon: -75.4671 },
    "Somerville,NJ": { lat: 40.5743, lon: -74.6099 },
    "Newton,NJ": { lat: 41.0579, lon: -74.7527 },
    "Elizabeth,NJ": { lat: 40.6640, lon: -74.2107 },
    "Washington,NJ": { lat: 40.7584, lon: -74.9788 },
    "Wildwood,NJ": { lat: 38.9918, lon: -74.8149 },
    // Major US Cities
    "New York,NY": { lat: 40.7128, lon: -74.0060 },
    "Los Angeles,CA": { lat: 34.0522, lon: -118.2437 },
    "Chicago,IL": { lat: 41.8781, lon: -87.6298 },
    "Miami,FL": { lat: 25.7617, lon: -80.1918 },
    "Houston,TX": { lat: 29.7604, lon: -95.3698 },
    "Phoenix,AZ": { lat: 33.4484, lon: -112.0740 },
    "Seattle,WA": { lat: 47.6062, lon: -122.3321 },
  };

  let closestChamber = chambers[0];
  let closestDistance = Infinity;

  for (const chamber of chambers) {
    if (!chamber.city || !chamber.state) continue;

    const key = `${chamber.city},${chamber.state}`;
    const coords = cityCoordinates[key];

    if (!coords) {
      console.warn(`[Chamber Matching] No coordinates for ${key}`);
      continue;
    }

    const distance = calculateDistance(userLat, userLon, coords.lat, coords.lon);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestChamber = chamber;
    }
  }

  console.log(`[Chamber Matching] Closest Chamber: ${closestChamber.name} (${closestDistance.toFixed(1)} miles away)`);
  return { ...closestChamber, distance: closestDistance };
}
