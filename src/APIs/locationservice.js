const BASE_URL = "https://govtregistrationapi.onrender.com/api/locations";

export const getStates = async () => {
  const res = await fetch(`${BASE_URL}/states`);
  return await res.json();
};

export const getLgas = async (state) => {
  const res = await fetch(`${BASE_URL}/lgas?state=${encodeURIComponent(state)}`);
  return await res.json();
};

export const getWards = async (state, lga) => {
  const res = await fetch(
    `${BASE_URL}/wards?state=${encodeURIComponent(state)}&lga=${encodeURIComponent(lga)}`
  );
  return await res.json();
};

export const getPollingUnits = async (state, lga, ward) => {
  const res = await fetch(
    `${BASE_URL}/polling-units?state=${encodeURIComponent(state)}&lga=${encodeURIComponent(lga)}&ward=${encodeURIComponent(ward)}`
  );
  return await res.json();
};