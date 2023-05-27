import axios from "axios";

export const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};

export const getLocationFromCoords = async (latitude, longitude) => {
  try {
    const res = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.status === 200) {
      return {
        city: res.data.locality,
        state: res.data.principalSubdivision,
        country: res.data.countryName,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
