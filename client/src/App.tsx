import { useState } from 'react';
import './App.css';

const baseUrl = 'https://frontend-take-home-service.fetch.com';

interface SearchResults {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number | ''>('');
  const [ageMax, setAgeMax] = useState<number | ''>('');
  const [size, setSize] = useState<number>(25);
  const [from, setFrom] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  async function handleLogin() {
    console.log(name, email);
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", response.status, errorData);
        throw new Error(`Login failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const allCookies = document.cookie;
      console.log("All cookies (document.cookie):", allCookies);
      console.log("Login successful!  Cookie set by server.");
      console.log(response);
      setLoggedIn(true);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async function getDogBreeds() {
    const response = await fetch(`${baseUrl}/dogs/breeds`, {
      credentials: 'include',
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
  }

  async function searchDogs() {
    const queryParams = new URLSearchParams();

    if (breeds.length > 0) queryParams.append('breeds', breeds.join(','));
    if (zipCodes.length > 0) queryParams.append('zipCodes', zipCodes.join(','));
    if (ageMin) queryParams.append('ageMin', ageMin.toString());
    if (ageMax) queryParams.append('ageMax', ageMax.toString());
    if (size) queryParams.append('size', size.toString());
    if (from) queryParams.append('from', from);
    if (sort) queryParams.append('sort', sort);

    const url = `${baseUrl}/dogs/search?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Search failed:", response.status, errorData);
        throw new Error(`Search failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data: SearchResults = await response.json();
      setSearchResults(data);
      console.log(data);
    } catch (error) {
      console.error("Error during search:", error);
      throw error;
    }
  }

  return !loggedIn ? (
    <>
      <h1>Hello World</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={getDogBreeds}>Get Dog Breeds</button>
    </>
  ) : (
    <>
      <h1>Dogs</h1>
      <div>
        <input type="text" placeholder="Breeds (comma separated)" onChange={(e) => setBreeds(e.target.value.split(','))} />
        <input type="text" placeholder="Zip Codes (comma separated)" onChange={(e) => setZipCodes(e.target.value.split(','))} />
        <input type="number" placeholder="Min Age" onChange={(e) => setAgeMin(Number(e.target.value))} />
        <input type="number" placeholder="Max Age" onChange={(e) => setAgeMax(Number(e.target.value))} />
        <input type="number" placeholder="Size" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        <input type="text" placeholder="From" onChange={(e) => setFrom(e.target.value)} />
        <input type="text" placeholder="Sort (e.g., breed:asc)" onChange={(e) => setSort(e.target.value)} />
        <button onClick={searchDogs}>Search Dogs</button>
      </div>
      <button onClick={getDogBreeds}>Get Dog Breeds</button>

      {searchResults && (
        <div>
          <h2>Search Results</h2>
          <p>Total Results: {searchResults.total}</p>
          <ul>
            {searchResults.resultIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
          {searchResults.next && (
            <button onClick={() => { setFrom(searchResults.next!); searchDogs(); }}>Next Page</button>
          )}
          {searchResults.prev && (
            <button onClick={() => { setFrom(searchResults.prev!); searchDogs(); }}>Previous Page</button>
          )}
        </div>
      )}
    </>
  );
}

export default App;