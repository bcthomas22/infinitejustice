import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL;

export function General() {

  const [outputLinks, setOutputLinks] = useState<string[]>([]);
  const [aiInputString, setAiInputString] = useState<string>("");
  const [linkInputString, setLinkInputString] = useState<string>("");
  const [initTopic, setInitTopic] = useState<string>("");
  const [relationScore, setRelationScore] = useState<string>("");
  const [topic, setTopic] = useState<string>("");

  useEffect(() => {
    console.log(outputLinks)
  }, [outputLinks])

  const getTopic = async () => {
    const res = await fetch(`${API_BASE}/api/getTopic`)

    if(!res.ok){
      throw new Error("Error with receiving topic");
    }

    const data = await res.json()
    setInitTopic(data.topic);
  }

  const compareTopics = async (topic1: string, topic2: string) => {
    if(topic1 === "" || topic2 === ""){
      return;
    }

    const res = await fetch(`${API_BASE}/api/aiGenerate/compareTopics`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt: `Topic 1: ${topic1}, Topic 2: ${topic2}`})
    })

    if(!res.ok){
      throw new Error("Error with comparing topics with ai");
    }

    const data = await res.json()
    setInitTopic(data.response);
    setRelationScore(data.score);
    setTopic(data.response);
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
      <button onClick={getTopic}>Get Topic</button>
      <div className='output-textbox'>
        <h2>Topic Given: </h2>
        <h1>{initTopic}</h1>
        <p className="output-text">What does {initTopic} lead to?</p>
        <p className="output-text">Score: {relationScore}</p>
      </div>

      <div className='input-div'>
        <input 
          type="text" 
          placeholder={"What does " + initTopic + " lead to?"}
          className='input-textbox'
          value={aiInputString}
          onChange={(e)=>{setAiInputString(e.target.value)}}
        >
        </input>
        <button onClick={() => compareTopics(initTopic, aiInputString)} className='input-button'>Ask</button>
      </div>

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


      <div>
        {topic && <>
        <a 
          href={"https://en.wikipedia.org/wiki/" + encodeURIComponent(topic)}
          target="_blank" 
          rel="noopener noreferrer"
        >
          Learn more about: {topic}
        </a>
      </>}
      </div>

    </div>
  )
}