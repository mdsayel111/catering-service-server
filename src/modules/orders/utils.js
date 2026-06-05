const { zonePolygon } = require("./data");

const API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ2OTE1NGQ2YjZkNTQzNTBhNTlhYzhmN2JhNjcxM2U5IiwiaCI6Im11cm11cjY0In0=";

async function getDistanceByCycle(start, end) {
  const url = "https://api.openrouteservice.org/v2/directions/cycling-regular";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        coordinates: [start, end],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${JSON.stringify(data)}`,
      );
    }

    // ✅ Support both possible response shapes
    let segment;
    if (data.features?.[0]?.properties?.segments?.[0]) {
      segment = data.features[0].properties.segments[0];
    } else if (data.routes?.[0]?.segments?.[0]) {
      segment = data.routes[0].segments[0];
    } else {
      console.error(
        "Unexpected response format:",
        JSON.stringify(data, null, 2),
      );
      return null;
    }

    const distanceKm = (segment.distance / 1000).toFixed(2);
    const durationMin = (segment.duration / 60).toFixed(1);

    return { distanceKm, durationMin };
  } catch (error) {
    console.error("Error fetching route:", error.message);
  }
}

/**
 * Check if a point (lat, lng) is inside a zonePolygon
 * @param {number} lat - latitude of the point
 * @param {number} lng - longitude of the point
 * @param {Array<Array<number>>} zonePolygon - array of [lat, lng] pairs
 * @returns {boolean} true if inside, false if outside
 */
function isPointInZone(lat, lng) {
  let inside = false;
  for (let i = 0, j = zonePolygon.length - 1; i < zonePolygon.length; j = i++) {
    const xi = zonePolygon[i][1],
      yi = zonePolygon[i][0]; // lng, lat
    const xj = zonePolygon[j][1],
      yj = zonePolygon[j][0];
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

module.exports = { getDistanceByCycle, isPointInZone };
