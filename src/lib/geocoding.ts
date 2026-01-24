export interface GeocodingResult {
  displayName: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Ramadan Medication App', // Required by Nominatim
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.village || item.address?.municipality || item.address?.county,
      country: item.address?.country,
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
}
