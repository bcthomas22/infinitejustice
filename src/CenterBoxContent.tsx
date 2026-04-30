import { TopicBox } from "./TopicBox";
import { CornerDownLeft, CornerDownRight, MoveDown, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export type TopicLink = {
    topic1: string | null
    topic2: string | null
    rating: number | undefined | null
    isHuman: boolean
}

export type TopicChain = {
    topicStart: string | null
    topicEnd: string | null
    rating: number | null
    allTopics: string[]
}

type CenterBoxContentProps = {
    startingTopic: string | null
    endingTopic: string | null
    currentTopic: string | null
    topicChain: TopicLink[]
    isAtGoal: boolean
    isExplorePage: boolean
    searchLinks: boolean
    exploreLinkList: TopicLink[]
    exploreChainList: TopicChain[]
    searchTopic: string | null
    setSearchTopic(s: string): void
    setTopicsForChain(s: string[]): void
    submitCurrent(): void
}

export function CenterBoxContent(props: CenterBoxContentProps) {

    const getSummary = async (topic: string) => {
        const res = await fetch(`${API_BASE}/api/aiGenerate/summarizeTopic`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({topic: topic})
        })

        if(!res.ok){
            throw new Error("Error with getting summary with ai");
        }

        const data: {summary: string} = await res.json();
        return data.summary;
    }

    return (
        <div className={`center-box-content${props.isExplorePage ? "-explore" : ""}`}>
            {!props.isExplorePage ? (
                <div className="chatbox">
                    <FirstTopicBox topic={props.startingTopic} />
                    {props.topicChain.map((l, i) => (
                        <TopicChat 
                            key={i}
                            topic1={l.topic1} 
                            topic2={l.topic2} 
                            rating={l.rating} 
                            isHuman={l.isHuman}>
                        </TopicChat>
                    ))}
                    <CurrentSummary 
                        currentTopic={props.currentTopic ?? ""}
                        getSummary={getSummary}
                    />
                    <GoalTopicBox 
                        topic={props.endingTopic} 
                        isAtGoal={props.isAtGoal} 
                        goal={props.endingTopic ?? ""}
                        submitCurrent={props.submitCurrent}
                        getSummary={getSummary}
                    />
                </div>
            ) : (
                <div className="searchbox">
                    <SearchTopicBox topic={props.searchTopic} isLink={props.searchLinks} />
                    <div className="explore-topics">
                        <div className="explore-topics-grid">
                            {props.searchLinks ? (
                                <>
                                    {props.exploreLinkList.length === 0 ? (
                                        <>
                                        <div className="loading"></div>
                                        </>
                                    ):(
                                        <>
                                        {props.exploreLinkList.map(l => (
                                            <div 
                                                className="explore-topics-grid-item"
                                                onClick={() => {if (l.topic2) props.setSearchTopic(l.topic2)}}
                                            >
                                                <TopicBox
                                                    topic1={l.topic1}
                                                    topic2={l.topic2}
                                                    rating={l.rating}
                                                    isHuman={l.isHuman}
                                                    isChain={false}
                                                />
                                            </div>
                                        ))}
                                        </>
                                    )}
                                </>
                            ):(
                                <>
                                    {props.exploreLinkList.length === 0 ? (
                                        <>
                                        <div className="loading"></div>
                                        </>
                                    ):(
                                        <>
                                        {props.exploreChainList.map(c => (
                                            <div className="chain-topic-box">
                                                <div className="explore-topics-grid-item-chain">
                                                    <TopicBox
                                                        topic1={c.topicStart}
                                                        topic2={c.topicEnd}
                                                        rating={c.rating}
                                                        isHuman={true}
                                                        isChain={true}
                                                    />
                                                    <button onClick={() => props.setTopicsForChain(c.allTopics)}>
                                                        View Full Chain
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        </>
                                    )}
                                </>
                            )}  
                        </div>
                    </div>
                </div>
            ) }
            </div>
    )
}

type CurrentSummaryProps = {
    currentTopic: string
    getSummary(s: string): Promise<string>
}

function CurrentSummary (props: CurrentSummaryProps) {

    const [summary, setSummary] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const updateSummary = async () => {
        setShow(prev => (!prev))
        if(summary) return;
        const s = await props.getSummary(props.currentTopic);
        setSummary(s);
    }

    useEffect(() => {
        setSummary(null);
        setShow(false)
    }, [props.currentTopic])

    return (
        <div className="summary-area">
            <button 
                className="summary-button"
                onClick={() => {updateSummary()}}
            >
                <p>Summary for: {props.currentTopic}</p>
                {show ? <ChevronDown /> : <ChevronUp />}
            </button>
            {show && <div className="summary-text">{summary ?? <div className="loading summary-loading"></div>}</div>}
        </div>
    )
}

type SearchTopicBoxProps = {
    topic: string | null;
    isLink: boolean;
}

function SearchTopicBox(props: SearchTopicBoxProps) {
    return (
        <div className="search-topic-box">
            <div className="first-topic-box">
                <span className="starting-topic-label">{props.isLink ? "Searching links for: " : "Searching chains for: "}</span>
                <span className="starting-topic">{props.topic ?? <div className="loading"></div>}</span>
            </div>
        </div>
    )
}

type FirstTopicBoxProps = {
    topic: string | null;
}

function FirstTopicBox(props: FirstTopicBoxProps) {
    return (
        <div className="first-topic-box">
            <p className="starting-topic-label">Starting topic: </p>
            <p className="starting-topic">{props.topic ?? <div className="loading"></div>}</p>
        </div>
    )
}

type GoalTopicBoxProps = {
    topic: string | null;
    isAtGoal: boolean
    goal: string
    submitCurrent(): void 
    getSummary(s: string): Promise<string>
}

function GoalTopicBox(props: GoalTopicBoxProps) {

    const [subState, setSubState] = useState<string | 1 | 2 >("Submit Chain")
    const [block, setBlock] = useState<boolean>(false);

    const submit = () => {
        if(block) return;
        setBlock(true);
        props.submitCurrent()
        setSubState(1);
        setTimeout(() => {
            setSubState(2);
        }, 1000);
        setTimeout(() => {
            setSubState("Submit Chain");
        }, 2000);
        setBlock(false);
    }

    const [summary, setSummary] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const updateSummary = async () => {
        setShow(prev => (!prev))
        if(summary) return;
        const s = await props.getSummary(props.goal);
        setSummary(s);
    }

    useEffect(() => {
        setSummary(null);
        setShow(false)
    }, [props.goal])

    return (<>{props.isAtGoal ? (
    <>
        <div className="submit-area">
            <div className="starting-topic-label">You reached the goal: {props.goal}</div>
            <button 
                className="submit-button"
                onClick={() => {submit()}}
            >{
                subState === 1 ? <div className="loading"></div> :
                subState === 2 ? <Check /> :
                subState
            }</button>
        </div>
    </>
    ):(
    <>
        <div className="down-arrow-goal"><MoveDown size={75}/></div>
        <div className="goal-topic-box">
            <p className="starting-topic-label">Goal to reach: </p>
            <p className="starting-topic">{props.topic ?? <div className="loading"></div>}</p>
        </div>
        <div className="goal-summary-area">
            <button 
                className="summary-button"
                onClick={() => updateSummary()}
            >
                <p>Summary for: {props.goal}</p>
                {show ? <ChevronDown /> : <ChevronUp />}
            </button>
            {show && <div className="summary-text">{summary ?? <div className="loading summary-loading"></div>}</div>}
        </div>
    </>
    )}</>)
}

type TopicChatProps = TopicLink

function TopicChat(props: TopicChatProps) {
    return (
        <div className="topic-chat">
            {props.isHuman ? ( <>
                <div className="chat-arrow"><CornerDownRight size={75} /></div>
                <div className="topic-box-holder">
                    <TopicBox 
                        topic1={props.topic1} 
                        topic2={props.topic2} 
                        rating={props.rating} 
                        isHuman={props.isHuman}
                        isChain={false}
                    />
                </div> </>
            ) : ( <>
                <div className="topic-box-holder">
                    <TopicBox 
                        topic1={props.topic1} 
                        topic2={props.topic2} 
                        rating={props.rating} 
                        isHuman={props.isHuman}
                        isChain={false}
                    />
                </div> 
                <div className="chat-arrow"><CornerDownLeft size={75} /></div></>
            )}
        </div>
    )
}