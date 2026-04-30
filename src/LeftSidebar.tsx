import { X, Check } from "lucide-react";
import { useState } from "react";

type LeftSidebarProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    isExplorePage: boolean
    startingTopic: string | null
    endingTopic: string | null
    restartGame(): void 
    topicsStringList: string[]
    percentComplete: number | null
    averageRating: number | null
    submitCurrent(): void
    searchTopic: string | null
    setSearchTopic(s: string | null): void
    searchLinks: boolean
    setSearchLinks(b: boolean): void
    topicsForChain: string[]
}

export function LeftSidebar(props: LeftSidebarProps) {

    return ( 
    <>
        {props.isSidebarOpen && 
            <div className="left-sidebar">
                <button 
                    className="close-left-sidebar" 
                    onClick={() => {props.setIsSidebarOpen(false)}}
                >
                    <X/>
                </button>
                <div className="left-sidebar-scroll">
                    {!props.isExplorePage ? (
                        <>
                            <div className="left-sidebar-label">
                                <span className="header-main-text">Create</span>
                            </div>

                            <StartEndButtons 
                                restartGame={props.restartGame}
                                submitCurrent={props.submitCurrent}
                            />

                            <div className="left-sidebar-label">
                                <span className="header-main-text">Progress</span>
                            </div>

                            <ProgressBar 
                                label="Percent Complete" 
                                displayValue={props.percentComplete !== null ? `${props.percentComplete}%` : null} 
                                value={props.percentComplete ?? 0} 
                                max={100} 
                            />
                            <ProgressBar 
                                label="Average Rating" 
                                displayValue={props.averageRating !== null ? `${props.averageRating}` : null}
                                value={props.averageRating ?? 0} 
                                max={100} 
                            />

                            <ProgressTopicList topics={props.topicsStringList} goal={props.endingTopic ?? "Goal"}/>

                            <div className="left-sidebar-label">
                                <span className="header-main-text">Help</span>
                            </div>

                            <WhatAmIDoing start={props.startingTopic ?? "Pollution"} goal={props.endingTopic ?? "Air Quality"}/>
                            {/*<HintSummaryButtons currentTopic={props.topicsStringList[props.topicsStringList.length - 1]}/>*/}
                        </>
                    ):(
                        <>
                            <div className="left-sidebar-label">
                                    <span className="header-main-text">Search</span>
                            </div>

                            <SearchTopic 
                                searchTopic={props.searchTopic} 
                                setSearchTopic={props.setSearchTopic}
                            />

                            {/*<TopicList label="Past Topics:" topics={[Make array for past links]} />}*/}

                            <LinkChainButtons setSearchLinks={props.setSearchLinks} searchLinks={props.searchLinks}/>

                            <TopicList 
                                label={`Topics for chain: ${props.topicsForChain[0] ?? "(N/A)"} to ${props.topicsForChain[props.topicsForChain.length - 1] ?? "(N/A)"}`} 
                                topics={props.topicsForChain} 
                            />
                        </>
                    )}
                </div>
            </div>
        }
    </> 
    )
}

type SearchTopicProps = {
    searchTopic: string | null
    setSearchTopic(s: string): void
}

function SearchTopic(props: SearchTopicProps) {

    const [input, setInput] = useState<string>("")

    const send = () => {
        props.setSearchTopic(input)
        setInput("")
    }

    return (
        <div className="left-sidebar-element">
            <input 
                placeholder="Search for a topic..."
                value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                }}
                onKeyDown={(e) => {if (e.key === "Enter") send()}}
            ></input>
            <button
                onClick={() => send()}
            >Search</button>
        </div>
    )
}

type LinkChainButtonsProps = {
    setSearchLinks(b: boolean): void
    searchLinks: boolean
}

function LinkChainButtons(props: LinkChainButtonsProps) {
    return (
        <div className="left-sidebar-element">
            <p className="progress-bar-text" >Search for:</p>
            <button className={`left-sidebar-buttons ${props.searchLinks ? "selected" : ""}`}
                onClick={() => props.setSearchLinks(true)}
            >Links</button>
            <button className={`left-sidebar-buttons ${!props.searchLinks ? "selected" : ""}`}
                onClick={() => props.setSearchLinks(false)}
            >Chains</button>
        </div>
    )
}

type StartEndButtonsProps = {
    restartGame(): void
    submitCurrent(): void
}

function StartEndButtons(props: StartEndButtonsProps) {

    const [subState, setSubState] = useState<string | 1 | 2 >("Submit")
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
            setSubState("Submit");
        }, 2000);
        setBlock(false);
    }

    return (
        <div className="left-sidebar-element">
            <button className="left-sidebar-buttons"
                onClick={() => {props.restartGame()}}
            >Restart</button>
            <button className="left-sidebar-buttons"
                onClick={() => submit()}
            >{
                subState === 1 ? <div className="loading"></div> :
                subState === 2 ? <Check /> :
                subState
            }</button>
        </div>
    )
}

/*
type HintSummaryButtonsProps = {
    currentTopic: string
}

function HintSummaryButtons(props: HintSummaryButtonsProps) {
    return (
        <div className="left-sidebar-element">
            <p>Current topic: {props.currentTopic}</p>
            <button>Hint</button>
            <button>Summary</button>
        </div>
    )
}
*/

type TopicListProps = {
    topics: string[]
    label: string

}

function TopicList(props: TopicListProps) {
    return (
        <div className="left-sidebar-element">
            <p className="progress-bar-text">{props.label}</p>
            {props.topics.map((t, i) => (
                <div key={i} className="plain-topic-holder">{t}</div>
            ))}
        </div>
    )
}


type ProgressTopicListProps = {
    topics: string[]
    goal: string
}

function ProgressTopicList(props: ProgressTopicListProps) {

    const start = props.topics[0]
    const curr = props.topics[props.topics.length - 1]
    const rest = props.topics.filter((_o,i) => i!==0 && i!==props.topics.length - 1) 

    return (
        <div className="left-sidebar-element">
            <p className="progress-bar-text">Start:</p>
            <div className="plain-topic-holder">{start}</div>
            <p className="progress-bar-text">Progress:</p>
            {rest.map((t, i) => (
                <div key={i} className="plain-topic-holder">{t}</div>
            ))}
            <p className="progress-bar-text">Current:</p>
            <div className="plain-topic-holder">{curr}</div>
            <p className="progress-bar-text">Goal:</p>
            <div className="plain-topic-holder">{props.goal}</div>
        </div>
    )
}

type ProgressBarProps = {
    label: string
    displayValue: string | null
    value: number
    max: number
}

function ProgressBar(props: ProgressBarProps) {
    return (
        <div className="left-sidebar-element">
            <span className="progress-bar-text">{props.label}</span>
            <div className="progress-bar-holder">
                <span className="progress-bar-number">{props.displayValue ?? <div className="loading"></div>}</span>
                <progress className="progress-bar" value={props.value} max={props.max} />
            </div>
        </div>
    )
}

type WhatAmIDoingProps = {
    start: string
    goal: string
}

function WhatAmIDoing(props: WhatAmIDoingProps) {
    return (
        <div className="left-sidebar-element">
            <span className="header-main-text">
                What Am I Doing?
            </span>
            <div>
                <div className="waid-text">
                    <p><span className="waid-text-B">You are working with an AI to create a Justice Chain!</span> A Justice Chain is a chain of topics, starting from {props.start} and eventually leading to {props.goal}.</p>
                    <ul>
                        <li>One by one, <span className="waid-text-B">you must come up with new topics</span> that logically come from the previous topic</li>
                        <li><span className="waid-text-B">The AI will rate your response each time</span>, encouraging higher ratings and keeping you on track</li>
                        <li>Try to ease your way, and <span className="waid-text-B">slowly progress from {props.start} to {props.goal}</span>. It may be tricky to bridge the gap, but AI will help</li>
                        <li><span className="waid-text-B">Each response is</span> a link between 2 topics, and will be <span className="waid-text-B">anonymously stored</span> for others to explore in the explore page</li>
                        <li>When you reach the goal, you can <span className="waid-text-B">submit your chain to the explore page</span>, try to keep a good average score!</li>
                    </ul>
                    <p>Good luck! If you get stuck, don't be afraid to use the <span className="waid-text-B">hint button</span>, or <span className="waid-text-B">ask for a summary of the current topic</span> for help.</p>
                </div>
            </div>
        </div>
    )
}