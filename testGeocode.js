import { geocodeAddress } from "./src/utils/geocode.js";

async function test() {
  const address = "Gowra Fountain Head, 8th Floor, Hyderabad, Telangana 500081";
  const result = await geocodeAddress(address);
  console.log("📍 Geocoded Result:", result);
}

test();
