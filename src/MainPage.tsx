import { useState, useEffect } from "react"
import { CreateExploreTabs } from "./CreateExploreTabs";
import { CreatePage } from "./CreatePage";
import { ExplorePage } from "./ExplorePage";
import { useMediaQuery } from 'react-responsive';

export function MainPage() {

    //false is create, true is explore
    const [activeTab, setActiveTab] = useState<boolean>(false);

    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isPortrait);

    const [latestTopic, setLatestTopic] = useState<string | null>(null);

    useEffect(() => {
        setIsSidebarOpen(!isPortrait);
    }, [isPortrait]);

    const updateTopic = (s: string) => {
        setLatestTopic(s);
    }

    return (
        <div className="main-contents">

            <div className="page-contents">
                {activeTab ? (
                    <div className="explore-page">
                        <ExplorePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} mostRecentTopic={latestTopic ?? "Pollution"}/>
                    </div>
                ) : (
                    <div className="create-page">
                        <CreatePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} updateTopic={updateTopic}/>
                    </div>
                )}
            </div>
            
            <CreateExploreTabs state={activeTab} setState={setActiveTab}/>

        </div>
    )
}