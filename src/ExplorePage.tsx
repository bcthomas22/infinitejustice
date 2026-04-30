import { LeftSidebar } from "./LeftSidebar";
import { CenterBox } from "./CenterBox";
import { useEffect, useState } from "react";
import { type TopicChain, type TopicLink } from "./CenterBoxContent" 

const API_BASE = import.meta.env.VITE_API_URL;

const MAX_LINKS = 48;

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
        if (searchLinks) 
            fetchLinks(searchTopic, true)
        else 
            fetchChains(searchTopic, true)
    }, [searchTopic, searchLinks])

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
        })).filter(l => !databaseLinks.map(d => d.topic2).includes(l.topic2));

        const allLinks = [...databaseLinks, ...aiLinks, ...wikiLinks].slice(0, MAX_LINKS);
        setListedLinks(allLinks);
    }

    const fetchChains = async (topic: string, searchStartTopics: boolean) => {
        setListedChains([]);

        const resDB = await fetch(`${API_BASE}/api/accessDB/getChains`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({topic: topic, searchStartTopics: searchStartTopics})
        })

        if(!resDB.ok){
            throw new Error("Error with getting links from DB");
        }

        const dataDB: any[] = await resDB.json()
        const databaseChains = dataDB.map<TopicChain>(c => ({
            topicStart: c.start_topic,
            topicEnd: c.end_topic,
            rating: c.rating,
            allTopics: c.topic_chain.split(",")
        }))

        setListedChains(databaseChains)
    }

    const updateSearchTopic = (s: string) => {
        setSearchTopic(s);
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
                submitCurrent={() => {}}

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
                submitCurrent={() => {}}
                isAtGoal={false}

                searchTopic={searchTopic}
                sendTopicToChat={(_s: string) => {}}
                setTopicsForChain={(c: string[]) => setTopicsForChain(c)}
                listedChains={listedChains}
                listedLinks={listedLinks}
                setSearchTopic={updateSearchTopic}
            />
        </>
    )
}