import { TopicBox } from "./TopicBox";
import { CornerDownLeft, CornerDownRight, MoveDown } from "lucide-react";

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
    topicChain: TopicLink[]
    isExplorePage: boolean
    searchLinks: boolean
    exploreLinkList: TopicLink[]
    exploreChainList: TopicChain[]
    searchTopic: string | null
    setTopicsForChain(s: string[]): void
}


export function CenterBoxContent(props: CenterBoxContentProps) {
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
                    <GoalTopicBox topic={props.endingTopic} />
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
                                            <div className="explore-topics-grid-item">
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
                                                <div className="explore-topics-grid-item">
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
}

function GoalTopicBox(props: GoalTopicBoxProps) {
    return (<>
    <div className="down-arrow-goal"><MoveDown size={75}/></div>
        <div className="goal-topic-box">
            <p className="starting-topic-label">Goal to reach: </p>
            <p className="starting-topic">{props.topic ?? <div className="loading"></div>}</p>
        </div>
    </>)
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