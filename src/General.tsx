import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL;

export function General() {

  const [outputString, setOutputString] = useState<string>("AI will respond here...");
  const [inputString, setInputString] = useState<string>("");

  const getSomething = async () => {
      const res = await fetch(`${API_BASE}/api/doSomething`);

      if(!res.ok){
        throw new Error("Error with getting string");
      }

      const data = await res.json();
      setOutputString(data.value);
  }

  const askAI = async () => {
    if(inputString === ""){
      return;
    }

    setOutputString("Asking...");

    const res = await fetch(`${API_BASE}/api/aiGenerate`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt: inputString})
    })

    if(!res.ok){
      throw new Error("Error with asking ai");
    }

    const data = await res.json()
    setInputString("");
    setOutputString(data.response);
  }

  return (
    <div className='main-sect'>
      <div className='output-textbox'>
        <h2>Output: </h2>
        <p className="output-text">{outputString}</p>
      </div>

      <div className='input-div'>
        <input 
          type="text" 
          placeholder='Ask me something...' 
          className='input-textbox'
          value={inputString}
          onChange={(e)=>{setInputString(e.target.value)}}
        >
        </input>
        <button onClick={askAI} className='input-button'>Ask</button>
      </div>

      <button onClick={getSomething}>Get Something</button>

    </div>
  )
}