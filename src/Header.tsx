import { Trophy, User } from "lucide-react";
import { Profie } from "./Profile"; 
import { useState } from "react";

type HeaderProps = {
    setShowLeaderboard: React.Dispatch<React.SetStateAction<boolean>>
}

export function Header(props: HeaderProps) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <header>
                <button className="header-btn" onClick={() => props.setShowLeaderboard(true)}>
                    <Trophy size={30} />
                </button>
                <button className="header-btn" onClick={() => props.setShowLeaderboard(false)}>
                    Shmack Counter
                </button>
                <button className="header-btn" onClick={toggleSidebar}>
                    <User size={30} />
                </button>
            </header>

            <Profie isOpen={sidebarOpen} onClose={closeSidebar}/>
        </>
    )
}