import { Send } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { useState } from "react";

type CenterBoxFooterProps = {
    sendTopicToChat(s: string): void
    currentTopic: string
}

export function CenterBoxFooter(props: CenterBoxFooterProps) {

    const [inputText, setInputText] = useState<string>("");

    const send = () => {
        props.sendTopicToChat(inputText);
        setInputText("")
    }

    return (
        <div className="center-box-footer">
            <div className="chat-input">
                <button className="icon-button hint-button">
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
                    onClick={send}>
                    
                    <Send />
                </button>
            </div>
        </div>
    )
}