import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL;

export function General() {

  const [outputLinks, setOutputLinks] = useState<string[]>([]);
  const [hintLinks, setHintLinks] = useState<string[]>([]);
  const [aiInputString, setAiInputString] = useState<string>("");
  const [linkInputString, setLinkInputString] = useState<string>("");
  const [initTopic, setInitTopic] = useState<string>("");
  const [relationScore, setRelationScore] = useState<number>(0);
  const [topic, setTopic] = useState<string>("");
  const [goal, setGoal] = useState<string>();
  const [percentComplete, setPercentComplete] = useState<number>(0);
  const [summary, setSummary] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);

  const getTopic = async () => {
    const res = await fetch(`${API_BASE}/api/getTopic`)

    if(!res.ok){
      throw new Error("Error with receiving topic");
    }

    const data = await res.json()
    setInitTopic(data.topic);
    setPercentComplete(0);
    setRelationScore(0);
    setGoal(data.goal);
    setFinished(false);
  }

  const getSumAndHint = async (topic: string) => {
    if(topic === ""){
      return;
    }

    const resSum = await fetch(`${API_BASE}/api/aiGenerate/summarizeTopic`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({topic: topic})
    })

    const resHinArr = await fetch(`${API_BASE}/api/aiGenerate/getHintsFromTopic`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({topic: topic})
    })

    if(!resSum.ok){
      throw new Error("Error with getting summary with ai");
    }

    if(!resHinArr.ok){
      throw new Error("Error with getting hints with ai");
    }

    const dataSum = await resSum.json()
    const dataArr = await resHinArr.json()

    setSummary(dataSum.summary);
    setHintLinks(dataArr.hints);
  }

  const compareTopics = async (topic1: string, topic2: string) => {
    if(topic1 === "" || topic2 === ""){
      return;
    }

    const res = await fetch(`${API_BASE}/api/aiGenerate/compareTopics`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt: `Topic 1: ${topic1}, Topic 2: ${topic2}, Goal: ${goal}`})
    })

    if(!res.ok){
      throw new Error("Error with comparing topics with ai");
    }

    const data = await res.json()

    if (topic2 == goal){
      setPercentComplete(100);
      setRelationScore(data.score);
      setFinished(true);
      return;
    }

    setInitTopic(data.response);
    setRelationScore(data.score);
    setTopic(data.response);

    if (data.response == goal){
      setPercentComplete(100);
      setFinished(true);
      return;
    }

    const resProg = await fetch(`${API_BASE}/api/aiGenerate/getProgress`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt: `Topic: ${data.response}, Goal: ${goal}`})
    })

    if(!resProg.ok){
      throw new Error("Error with finding progress with ai");
    }

    const dataProg = await resProg.json()
    setPercentComplete(dataProg.score)
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
        <p className="output-text">Goal: {goal}</p>
        <p className="output-text">Percent Complete: {percentComplete}</p>
      </div>

      {!finished && (
        <div className='input-div'>
          <input 
            type="text" 
            placeholder={"What does " + initTopic + " lead to?"}
            className='input-textbox'
            value={aiInputString}
            onChange={(e)=>{setAiInputString(e.target.value)}}
          >
          </input>
          <button onClick={() => compareTopics(initTopic, aiInputString)} className='input-button'>Send</button>
        </div>
      )}

      <button onClick={() => getSumAndHint(initTopic)} className='input-button'>Get Hint/Summary</button>

      <h2>Summary for: {initTopic}</h2>
      <p>{summary}</p>

      <h2>Hints for: {initTopic}</h2>
      {hintLinks.map((l,i) => (
        
        <button
        key={i}
        onClick={() => {
          setAiInputString(l);
        }}
        >
          <h2>{l}</h2>
        </button>
        )
          
        )}

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