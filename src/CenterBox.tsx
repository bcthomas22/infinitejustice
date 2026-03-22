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
    searchTopic: string | null
    setTopicsForChain(s: string[]): void
    listedLinks: TopicLink[]
    listedChains: TopicChain[]
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
                    topicChain={props.currentCreateLinks} 
                    isExplorePage={false} 
                    searchLinks={false}
                    searchTopic={null}
                    exploreLinkList={props.listedLinks}
                    exploreChainList={props.listedChains}
                    setTopicsForChain={props.setTopicsForChain}
                /> 
                <CenterBoxFooter 
                    sendTopicToChat={props.sendTopicToChat}
                    currentTopic={props.mostRecentTopic}
                /> </>
            ) : ( <>
                <CenterBoxHeader 
                    isSidebarOpen={props.isSidebarOpen} 
                    setIsSidebarOpen={props.setIsSidebarOpen}
                />
                <CenterBoxContent 
                    startingTopic={props.startingTopic} 
                    endingTopic={props.endingTopic}
                    topicChain={props.currentCreateLinks} 
                    isExplorePage={true} 
                    searchLinks={props.searchLinks}
                    searchTopic={props.searchTopic}
                    exploreLinkList={props.listedLinks}
                    exploreChainList={props.listedChains}
                    setTopicsForChain={props.setTopicsForChain}
                /> </>
            )}
        </div>
    )
}