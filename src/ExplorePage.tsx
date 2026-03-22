import { LeftSidebar } from "./LeftSidebar";
import { CenterBox } from "./CenterBox";
import { useEffect, useState } from "react";
import { type TopicChain, type TopicLink } from "./CenterBoxContent" 

type ExplorePageProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExplorePage(props: ExplorePageProps) {

    const [searchTopic, setSearchTopic] = useState<string | null>("...")
    const [searchLinks, setSearchLinks] = useState<boolean>(true);
    const [topicsForChain, setTopicsForChain] = useState<string[]>([]);
    const [listedLinks, setListedLinks] = useState<TopicLink[]>([])
    const [listedChains, setListedChains] = useState<TopicChain[]>([]);

    useEffect(() => {
        /* Fetch database (IMPLEMENT ME)*/
        setListedLinks([...listedLinks, {
            topic1: searchTopic,
            topic2: null,
            rating: null,
            isHuman: true
        }])
        setListedChains([...listedChains, {
            topicStart: searchTopic,
            topicEnd: null,
            rating: null,
            allTopics: ["A", "Whole", "Lot", "Of", "Nothing"]
        }])
    }, [searchTopic])

    return (
        <>
            <LeftSidebar 
                isSidebarOpen={props.isSidebarOpen} 
                setIsSidebarOpen={props.setIsSidebarOpen}
                isExplorePage={true}
                startingTopic={null}
                endingTopic={null}
                restartGame={() => {}}
                topicsStringList={[]}
                averageRating={null}
                percentComplete={null}
                searchTopic={searchTopic}
                setSearchTopic={(s: string | null) => {setSearchTopic(s)}}
                searchLinks={searchLinks}
                setSearchLinks={(b: boolean) => setSearchLinks(b)}
                topicsForChain={topicsForChain}
            />
            <CenterBox 
                isSidebarOpen={props.isSidebarOpen} 
                setIsSidebarOpen={props.setIsSidebarOpen} 
                isExplorePage={true}
                searchLinks={searchLinks}
                startingTopic={null}
                endingTopic={null}
                currentCreateLinks={[]}
                mostRecentTopic={""}
                searchTopic={searchTopic}
                sendTopicToChat={(_s: string) => {}}
                setTopicsForChain={(c: string[]) => setTopicsForChain(c)}
                listedChains={listedChains}
                listedLinks={listedLinks}
            />
        </>
    )
}