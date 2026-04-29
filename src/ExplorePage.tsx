import { LeftSidebar } from "./LeftSidebar";
import { CenterBox } from "./CenterBox";
import { useEffect, useState } from "react";
import { type TopicChain, type TopicLink } from "./CenterBoxContent" 

const API_BASE = import.meta.env.VITE_API_URL;

type ExplorePageProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    mostRecentTopic: string
}

export function ExplorePage(props: ExplorePageProps) {

    const [searchTopic, setSearchTopic] = useState<string>(props.mostRecentTopic)
    const [searchLinks, setSearchLinks] = useState<boolean>(true);
    const [topicsForChain, setTopicsForChain] = useState<string[]>([]);
    const [listedLinks, setListedLinks] = useState<TopicLink[]>([])
    const [listedChains, setListedChains] = useState<TopicChain[]>([]);

    useEffect(() => {
        if (searchLinks) fetchLinks(searchTopic, true)

        setListedChains([...listedChains, {
            topicStart: searchTopic,
            topicEnd: null,
            rating: null,
            allTopics: ["A", "Whole", "Lot", "Of", "Nothing"]
        }])
    }, [searchTopic])

    const fetchLinks = async (topic: string, searchStartTopics: boolean) => {
        setListedLinks([]);

        const resDB = await fetch(`${API_BASE}/api/accessDB/getLinks`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({topic: topic, searchStartTopics: searchStartTopics})
        })

        if(!resDB.ok){
            throw new Error("Error with getting links from DB");
        }

        const resAI = await fetch(`${API_BASE}/api/aiGenerate/getHintsFromTopic`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({topic: topic})
        })

        if(!resAI.ok){
            throw new Error("Error with getting links with ai");
        }

        const resWK = await fetch(`${API_BASE}/api/fetchLinks`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({topic: topic})
        })

        if(!resWK.ok){
            throw new Error("Error with getting wiki links");
        }

        const dataWK: string[] = await resWK.json();
        const wikiLinks = dataWK.map<TopicLink>(l => ({
            topic1: topic,
            topic2: l,
            rating: null,
            isHuman: true
        }))

        const dataDB: any[] = await resDB.json();
        const databaseLinks = dataDB.map<TopicLink>(l => ({
            topic1: l.start_topic,
            topic2: l.end_topic,
            rating: l.rating == -1 ? undefined : l.rating,
            isHuman: l.is_human
        }));

        const dataAI: {hints: string[]} = await resAI.json();
        const aiLinks = dataAI.hints.map<TopicLink>(l => ({
            topic1: topic,
            topic2: l,
            rating: undefined,
            isHuman: false
        }));

        const allLinks = [...databaseLinks, ...aiLinks, ...wikiLinks].slice(0, 50);
        setListedLinks(allLinks);
    }

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
                setSearchTopic={(s: string) => {setSearchTopic(s)}}
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
                blockUserInput={false}
                searchTopic={searchTopic}
                sendTopicToChat={(_s: string) => {}}
                setTopicsForChain={(c: string[]) => setTopicsForChain(c)}
                listedChains={listedChains}
                listedLinks={listedLinks}
            />
        </>
    )
}