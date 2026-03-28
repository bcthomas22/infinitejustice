import { Send } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Keyboard } from 'lucide-react';
import { useEffect, useState } from "react";

type CenterBoxFooterProps = {
    sendTopicToChat(s: string): void
    currentTopic: string
}

const API_BASE = import.meta.env.VITE_API_URL;
const MAX_HINTS = 3;

export function CenterBoxFooter(props: CenterBoxFooterProps) {

    const [inputText, setInputText] = useState<string>("");
    const [showHints, setShowHints] = useState<boolean>(false);
    const [hints, setHints] = useState<string[]>(["Hint 1", "Hint 2", "Hint 3"]);

    const send = () => {
        props.sendTopicToChat(inputText);
        setHints([]);
        setInputText("")
    }

    const getHints = async (topic: string) => {
        if(topic === ""){
            return;
        }

        const resHinArr = await fetch(`${API_BASE}/api/aiGenerate/getHintsFromTopic`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({topic: topic})
        })

        if(!resHinArr.ok){
            throw new Error("Error with getting hints with ai");
        }

        const dataArr = await resHinArr.json()

        setHints(dataArr.hints);
    }

    useEffect(() => {
        if (showHints && hints.length === 0) {
            getHints(props.currentTopic)
        }
        console.log(hints)
    }, [showHints])

    return (
        <div className="center-box-footer">
            {!showHints ? (
                <div className="chat-input">
                <button 
                    className="icon-button hint-button"
                    onClick={() => {setShowHints(true)}}
                >
                    <Lightbulb />
                </button>
                <input 
                    className="chat-textbox" 
                    placeholder={`What does ${props.currentTopic} lead to?`}
                    value={inputText}
                    onChange={(e) => {setInputText(e.target.value)}}
                    onKeyDown={(e) => {if (e.key === "Enter") send()}}
                ></input>
                <button 
                    className="icon-button"
                    onClick={send}
                >    
                    <Send />
                </button>
            </div>
            ) : (<>
                <button
                    className="icon-button hint-button"
                    onClick={() => {setShowHints(false)}}
                ><Keyboard /></button>

                {hints.length === 0 && <div className="loading"></div>}

                {hints.map((h, i) => {
                    if (i >= MAX_HINTS) return;
                    return (<button
                        key={i}
                        onClick={() => {
                            setHints([]);
                            setShowHints(false);
                            setInputText("");
                            props.sendTopicToChat(h)
                        }}
                    >
                        {h}
                    </button>)
                })}
            </>)
            }

            
        </div>
    )
}