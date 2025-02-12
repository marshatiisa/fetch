import { useState } from 'react'
import './App.css'

const baseUrl = 'https://frontend-take-home-service.fetch.com';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // const handleLogin = async() => {
  //   console.log(name, email);
  //   const response = await fetch(`${baseUrl}/auth/login`, {
  //     method: 'POST',
  //     body: JSON.stringify({ name, email }),
  //   });
  //   console.log(response);
  // }

  async function handleLogin() {
    console.log(name, email);
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include', // Crucial:  Include credentials (cookies) in the request.
      });
  
      if (!response.ok) {
        const errorData = await response.json();  
        console.error("Login failed:", response.status, errorData);
        throw new Error(`Login failed with status ${response.status}: ${JSON.stringify(errorData)}`); // More informative error
      }
      const allCookies = document.cookie;
      console.log("All cookies (document.cookie):", allCookies);
      // Successful login.  The browser will automatically handle the HttpOnly cookie.
      // We don't need to access it directly here.
      console.log("Login successful!  Cookie set by server.");
      console.log(response);
      setLoggedIn(true);
      return response; // return full response
  
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Re-throw the error so the caller can handle it (e.g., display an error message to the user)
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


  return  !loggedIn ? (
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
      <button onClick={getDogBreeds}>Get Dog Breeds</button>
    </>
  )
}

export default App
