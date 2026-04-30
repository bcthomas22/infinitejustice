import { Send } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { Keyboard } from 'lucide-react';
import { useEffect, useState } from "react";

type CenterBoxFooterProps = {
    sendTopicToChat(s: string): void
    currentTopic: string
    blockUserInput: boolean
    isSidebarOpen: boolean
}

const API_BASE = import.meta.env.VITE_API_URL;
const MAX_HINTS = 3;
const MAX_CHARS = 30;

export function CenterBoxFooter(props: CenterBoxFooterProps) {

    const [inputText, setInputText] = useState<string>("");
    const [showHints, setShowHints] = useState<boolean>(false);
    const [hints, setHints] = useState<string[]>([]);

    const send = () => {
        props.sendTopicToChat(normalizeString(inputText).trim());
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

        const dataArr: {hints: string[]} = await resHinArr.json()

        setHints(dataArr.hints.sort(() => Math.random() - 0.5));
    }

    useEffect(() => {
        if (showHints && hints.length === 0) {
            getHints(props.currentTopic)
        }
    }, [showHints])

    const normalizeString =(s: string) => {
        const reg = s.replace(/[^a-zA-Z ]/g, "")
        const formatted = reg.charAt(0).toUpperCase() + reg.slice(1).toLowerCase();
        return formatted.slice(0, MAX_CHARS);
    }

    return (
        <div className={`center-box-footer ${props.isSidebarOpen ? "sidebar-open" : ""}`}>
            {!showHints ? (
                <div className="chat-input">
                <button 
                    className="icon-button hint-button"
                    onClick={() => {setShowHints(true)}}
                >
                    <Lightbulb />
                </button>
                <input 
                    disabled={props.blockUserInput}
                    className="chat-textbox" 
                    placeholder={`What does ${props.currentTopic.toLowerCase()} lead to?`}
                    value={normalizeString(inputText)}
                    onChange={(e) => {setInputText(normalizeString(e.target.value))}}
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