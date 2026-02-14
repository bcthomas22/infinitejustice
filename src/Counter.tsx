import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL;

export function General() {

  const [string, setString] = useState<string|null>(null);

  const getSomething = async () => {
      const res = await fetch(`${API_BASE}/api/doSomething`);

      if(!res.ok){
        throw new Error("Error with getting string");
      }

      const data = await res.json();
      setString(data.value);
  }

  return (
    <div className='counter'>
      <h1>
        Infinite Justice
      </h1>

      <button
        onClick={getSomething}
      >
        Do Something
      </button>

      <h2>{string}</h2>
    </div>
  )
}