import axios from 'axios';

const BASE_URL = 'https://musicbrainz.org/ws/2';

export const searchBandsByCity = async (city) => {
    const response = await axios.get(`${BASE_URL}/artist`, {
        params: {
            query: `area:${city} AND begin:[${new Date().getFullYear() - 10} TO *]`,
            fmt: 'json',
            limit: 50,
        },
    });
    return response.data.artists;
};
