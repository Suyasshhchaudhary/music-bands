import axios from 'axios';

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                async () => {
                    try {
                        const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                        resolve({ lat: response.data.latitude, lon: response.data.longitude });
                    } catch (error) {
                        reject('Unable to retrieve location');
                    }
                }
            );
        } else {
            axios.get('https://get.geojs.io/v1/ip/geo.json')
                .then(response => {
                    resolve({ lat: response.data.latitude, lon: response.data.longitude });
                })
                .catch(() => reject('Unable to retrieve location'));
        }
    });
};
