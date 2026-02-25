import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL;

export function General() {

  const [outputString, setOutputString] = useState<string>("AI will respond here...");
  const [outputLinks, setOutputLinks] = useState<string[]>([]);
  const [aiInputString, setAiInputString] = useState<string>("");
  const [linkInputString, setLinkInputString] = useState<string>("");
  const [topic, setTopic] = useState<string>("");

  const getSomething = async () => {
      const res = await fetch(`${API_BASE}/api/doSomething`);

      if(!res.ok){
        throw new Error("Error with getting string");
      }

      const data = await res.json();
      setOutputString(data.value);
  }

  const askAI = async () => {
    if(aiInputString === ""){
      return;
    }

    setOutputString("Asking...");

    const res = await fetch(`${API_BASE}/api/aiGenerate`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt: aiInputString})
    })

    if(!res.ok){
      throw new Error("Error with asking ai");
    }

    const data = await res.json()
    setAiInputString("");
    setOutputString(data.response);
  }

  const fetchLinks = async (input: string) => {
    if(input === ""){
      return;
    }

    const res = await fetch(`${API_BASE}/api/fetchLinks`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({topic: input})
    })

    if(!res.ok){
      throw new Error("Error with getting links");
    }

    const data = await res.json();
    setLinkInputString("");
    setOutputLinks(data);
    setTopic(input);
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
          value={aiInputString}
          onChange={(e)=>{setAiInputString(e.target.value)}}
        >
        </input>
        <button onClick={askAI} className='input-button'>Ask</button>
      </div>

      <button onClick={getSomething}>Get Something</button>

      <h2>Links: </h2>
      <div className='input-div'>
        <input 
          type="text" 
          placeholder='Enter a topic...' 
          className='input-textbox'
          value={linkInputString}
          onChange={(e)=>{setLinkInputString(e.target.value)}}
        >
        </input>
        <button onClick={() => fetchLinks(linkInputString)} className='input-button'>Search</button>
      </div>

      {topic && <>
        <h1>{topic}</h1>
        <h2>leads to:</h2>
      </>}

      {outputLinks.map((l,i) => (
        
        <button
        key={i}
        onClick={() => {
          setLinkInputString(l);
          fetchLinks(l);
        }}
        >
          <h2>{l}</h2>
        </button>)
          
        )}

    </div>
  )
}