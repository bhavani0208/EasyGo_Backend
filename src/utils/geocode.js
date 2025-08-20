import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.ORS_API_KEY;

// helper for geocoding
export async function geocodeAddress(address) {
  if (!address) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  console.log("🌍 Fetching URL:", url);

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "EasyGoApp/1.0" }, // required by Nominatim
    });

    console.log("📡 Raw Response:", data);
    if (data && data.length > 0) {
      const { lon, lat } = data[0];
      return [parseFloat(lon), parseFloat(lat)];
    }
    return null;
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
}
