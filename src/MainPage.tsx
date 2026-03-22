import {useState} from "react"
import { CreateExploreTabs } from "./CreateExploreTabs";
import { CreatePage } from "./CreatePage";
import { ExplorePage } from "./ExplorePage";

export function MainPage() {
    //false is create, true is explore
    const [activeTab, setActiveTab] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    return (
        <div className="main-contents">

            <div className="page-contents">
                {activeTab ? (
                    <div className="explore-page">
                        <ExplorePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                    </div>
                ) : (
                    <div className="create-page">
                        <CreatePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
                    </div>
                )}
            </div>
            
            <CreateExploreTabs state={activeTab} setState={setActiveTab}/>

        </div>
    )
}