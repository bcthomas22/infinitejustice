import { LeftSidebar } from "./LeftSidebar";
import { CenterBox } from "./CenterBox";
import { useEffect, useState } from "react";
import { type TopicLink } from "./CenterBoxContent"

const API_BASE = import.meta.env.VITE_API_URL;

type CreatePageProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreatePage(props: CreatePageProps) {

    const [startingTopic, setStartingTopic] = useState<string | null>(null);
    const [endingTopic, setEndingTopic] = useState<string | null>(null);
    const [currentLinks, setCurrentLinks] = useState<TopicLink[]>([]);
    const [mostRecentTopic, setMostRecentTopic] = useState<string | null>(null);
    const [percentComplete, setPercentComplete] = useState<number | null>(0);
    const [averageRating, setAverageRating] = useState<number | null>(0);

    useEffect(() => {
        startGame();
    }, [])

    const getStartingEndingTopic = async () => {
        const res = await fetch(`${API_BASE}/api/getTopic`)

        if(!res.ok){
            throw new Error("Error with receiving topic");
        }

        const data = await res.json()
        setStartingTopic(data.topic);
        setMostRecentTopic(data.topic);
        setEndingTopic(data.goal);
    }

    const startGame = async () => {
        await getStartingEndingTopic();
        setCurrentLinks([]);
        setAverageRating(0);
        setPercentComplete(0);
    }

    const compareTopicsAppendTo = async (topic1: string, topic2: string) => {

        if(endingTopic === null)
            return;

        if(topic1 === "" || topic2 === ""){
            return;
        }

        setMostRecentTopic(topic2);

        const initAddedLink: TopicLink = {
            topic1: topic1,
            topic2: topic2,
            rating:  null,
            isHuman: true
        }

        const initAILink: TopicLink = {
            topic1: null,
            topic2: null,
            rating: undefined,
            isHuman: false
        }

        setCurrentLinks([...currentLinks, initAddedLink]);
        setAverageRating(null);

        const res = await fetch(`${API_BASE}/api/aiGenerate/compareTopics`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({prompt: `Topic 1: ${topic1}, Topic 2: ${topic2}, Goal: ${endingTopic}`})
        })

        if(!res.ok){
            throw new Error("Error with comparing topics with ai");
        }

        const data = await res.json()

        const afterAddedLink: TopicLink = {
            topic1: topic1,
            topic2: topic2,
            rating:  data.score,
            isHuman: true
        }

        const afterAILink: TopicLink = {
            topic1: topic2,
            topic2: data.response,
            rating: undefined,
            isHuman: false
        }

        setCurrentLinks([...currentLinks.filter((_l, i) => (i === currentLinks.length-1)), afterAddedLink, initAILink]);

        await setTimeout(()=>{
            setCurrentLinks([...currentLinks.filter((_l, i) => (i === currentLinks.length-1)), afterAILink]);
        }, 500);

        getPercentComplete(data.response, endingTopic);
        setAverageRating(newAverageRating(currentLinks.filter(l => !l.isHuman).length, averageRating ?? 0, data.score))
    }

    const sendTopicToChat = (topic: string) => {
        if (topic === "" || mostRecentTopic === null)
            return;

        compareTopicsAppendTo(mostRecentTopic, topic)
    }

    const getPercentComplete = async(topic: string, goal: string) => {
        setPercentComplete(null);
        const resProg = await fetch(`${API_BASE}/api/aiGenerate/getProgress`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({prompt: `Topic: ${topic}, Goal: ${goal}`})
        })

        if(!resProg.ok){
            throw new Error("Error with finding progress with ai");
        }

        const dataProg = await resProg.json()
        setPercentComplete(dataProg.score)
    }

    const newAverageRating = (allRatedLinksLength: number, oldAverageRating: number, newRating: number) => {
        if(allRatedLinksLength === 0 || oldAverageRating === 0)
            return newRating;
        return Math.ceil(((allRatedLinksLength * oldAverageRating) + newRating) / (oldAverageRating + 1))
    }

    return (
        <div>
            <LeftSidebar 
                isSidebarOpen={props.isSidebarOpen} 
                setIsSidebarOpen={props.setIsSidebarOpen}
                isExplorePage={false}
                startingTopic={startingTopic}
                endingTopic={endingTopic}
                restartGame={startGame}
                topicsStringList={
                    currentLinks.flatMap(l => l.topic1 ? [l.topic1] : []).concat(mostRecentTopic ?? [])
                }
                percentComplete={percentComplete}
                averageRating={averageRating}
                searchTopic={null}
                setSearchTopic={(_s: string | null) => {}}
                searchLinks={false}
                setSearchLinks={(_b: boolean) => {}}
                topicsForChain={[]}
            />
            <CenterBox 
                isSidebarOpen={props.isSidebarOpen} 
                setIsSidebarOpen={props.setIsSidebarOpen} 
                isExplorePage={false} 
                searchLinks={false}
                startingTopic={startingTopic}
                endingTopic={endingTopic}
                currentCreateLinks={currentLinks}
                sendTopicToChat={sendTopicToChat}
                mostRecentTopic={mostRecentTopic ?? ""}
                searchTopic={null}
                setTopicsForChain={(_s: string[]) => {}}
                listedChains={[]}
                listedLinks={[]}
            />
        </div>
    )
}