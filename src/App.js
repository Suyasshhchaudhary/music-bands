import React, { useState, useEffect } from 'react';
import { getUserLocation } from './utils/geolocation';
import { searchBandsByCity } from './utils/musicBrainz';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocationAndBands = async () => {
      setLoading(true);
      try {
        const location = await getUserLocation();
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lon}`);
        const data = await response.json();
        const cityName = data.address.city || data.address.town || data.address.village;
        setCity(cityName);
        const bands = await searchBandsByCity(cityName);
        setBands(bands);
      } catch (error) {
        setError('Could not retrieve bands for your location');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndBands();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bands = await searchBandsByCity(city);
      setBands(bands);
    } catch (error) {
      setError('Could not retrieve bands for the specified city');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="App">
        <h1>Recently Founded Music Bands</h1>
        <form onSubmit={handleSearch}>
          <input
              type="text"
              placeholder="Enter a city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {loading ? <p>Loading...</p> : (
            <ul>
              {bands.map((band, index) => (
                  <li key={band.id}>
                    {index + 1}. {band.name} (Founded: {band['life-span'].begin || 'Unknown'})
                  </li>
              ))}
            </ul>
        )}
        {error && <p>{error}</p>}
      </div>
  );
}

export default App;
