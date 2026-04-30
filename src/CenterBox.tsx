import { CenterBoxContent } from "./CenterBoxContent";
import { CenterBoxFooter } from "./CenterBoxFooter";
import { CenterBoxHeader } from "./CenterBoxHeader";
import { type TopicLink, type TopicChain } from "./CenterBoxContent";

type CenterBoxProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    isExplorePage: boolean
    searchLinks: boolean
    startingTopic: string | null
    endingTopic: string | null
    currentCreateLinks: TopicLink[]
    sendTopicToChat(s: string): void
    mostRecentTopic: string
    blockUserInput: boolean
    isAtGoal: boolean
    submitCurrent(): void
    searchTopic: string | null
    setTopicsForChain(s: string[]): void
    listedLinks: TopicLink[]
    listedChains: TopicChain[]
    setSearchTopic(s: string): void
}

export function CenterBox(props: CenterBoxProps) {

    return ( 

        <div className={`center-box ${props.isSidebarOpen ? "sidebar-open" : ""}`}>
            {!props.isExplorePage ? ( <>
                <CenterBoxHeader 
                    isSidebarOpen={props.isSidebarOpen} 
                    setIsSidebarOpen={props.setIsSidebarOpen}
                />
                <CenterBoxContent 
                    startingTopic={props.startingTopic} 
                    endingTopic={props.endingTopic}
                    currentTopic={props.mostRecentTopic}
                    topicChain={props.currentCreateLinks} 
                    isExplorePage={false} 
                    searchLinks={false}
                    searchTopic={null}
                    isAtGoal={props.isAtGoal}
                    exploreLinkList={props.listedLinks}
                    exploreChainList={props.listedChains}
                    setTopicsForChain={props.setTopicsForChain}
                    submitCurrent={props.submitCurrent}
                    setSearchTopic={props.setSearchTopic}
                /> 
                <CenterBoxFooter 
                    sendTopicToChat={props.sendTopicToChat}
                    currentTopic={props.mostRecentTopic}
                    blockUserInput={props.blockUserInput}
                    isSidebarOpen={props.isSidebarOpen}
                /> </>
            ) : ( <>
                <CenterBoxHeader 
                    isSidebarOpen={props.isSidebarOpen} 
                    setIsSidebarOpen={props.setIsSidebarOpen}
                />
                <CenterBoxContent 
                    startingTopic={props.startingTopic} 
                    endingTopic={props.endingTopic}
                    currentTopic={props.mostRecentTopic}
                    topicChain={props.currentCreateLinks} 
                    isExplorePage={true} 
                    searchLinks={props.searchLinks}
                    searchTopic={props.searchTopic}
                    isAtGoal={props.isAtGoal}
                    exploreLinkList={props.listedLinks}
                    exploreChainList={props.listedChains}
                    setTopicsForChain={props.setTopicsForChain}
                    submitCurrent={props.submitCurrent}
                    setSearchTopic={props.setSearchTopic}
                /> </>
            )}
        </div>
    )
}